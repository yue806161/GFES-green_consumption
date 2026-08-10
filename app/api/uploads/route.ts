import { AuthError, requireAuth } from "../../../db/auth";
import { getPlatformDb } from "../../../db/platform";

const actionRules: Record<string, { title: string; rewardPoints: number }> = {
  reusable_cup: { title: "使用環保杯", rewardPoints: 10 },
  public_transport: { title: "搭乘大眾運輸", rewardPoints: 80 },
  ebill: { title: "改用電子帳單", rewardPoints: 50 },
  energy_appliance: { title: "購買節能家電", rewardPoints: 600 },
};

const farmerEvidenceTypes = new Set(["產銷履歷佐證", "無農藥檢測", "友善耕作紀錄", "低碳作業證明", "土壤檢測報告", "生態棲地紀錄"]);
const allowedFileTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

function validateFile(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return "請選擇要上傳的證明檔案";
  if (file.size > 10 * 1024 * 1024) return "檔案大小不可超過 10 MB";
  if (!allowedFileTypes.has(file.type)) return "僅支援 PDF、JPG、PNG 或 WebP";
  if (file.name.length > 180) return "檔名不可超過 180 個字";
  return "";
}

async function inspectFile(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const prefix = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const valid = file.type === "application/pdf"
    ? bytes.length >= 5 && prefix(0, 5) === "%PDF-"
    : file.type === "image/jpeg"
      ? bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      : file.type === "image/png"
        ? bytes.length >= 8 && bytes[0] === 0x89 && prefix(1, 4) === "PNG"
        : bytes.length >= 12 && prefix(0, 4) === "RIFF" && prefix(8, 12) === "WEBP";
  if (!valid) throw new Error("檔案內容與格式不符，已拒絕上傳");
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const sha256 = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return { bytes, sha256 };
}

async function getUploadsBucket() {
  const { env } = await import("cloudflare:workers");
  const uploads = (env as unknown as { UPLOADS?: R2Bucket }).UPLOADS;
  if (!uploads) throw new Error("檔案儲存服務尚未啟用");
  return uploads;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const submissionType = String(form.get("submissionType") ?? "consumer_action");
    const farmerUpload = submissionType === "farmer_evidence" || submissionType === "farmer_media";
    const session = await requireAuth(request, farmerUpload ? ["farmer"] : ["consumer"], true);
    const fileValue = form.get("file");
    const fileError = validateFile(fileValue);
    if (fileError) return Response.json({ error: fileError }, { status: 400 });
    const file = fileValue as File;
    const { bytes, sha256 } = await inspectFile(file);
    const db = await getPlatformDb();

    if (submissionType === "farmer_media") {
      if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) return Response.json({ error: "故事與消息圖片僅支援 JPG、PNG 或 WebP" }, { status: 400 });
      const mediaKind = String(form.get("mediaKind") ?? "");
      if (mediaKind !== "story" && mediaKind !== "news") return Response.json({ error: "圖片用途不正確" }, { status: 400 });
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "farmer-media";
      const fileKey = `farmer-media/${session.profileId}/${mediaKind}/${crypto.randomUUID()}-${safeName}`;
      const uploads = await getUploadsBucket();
      await uploads.put(fileKey, bytes, { httpMetadata: { contentType: file.type }, customMetadata: { farmerId: session.profileId, mediaKind, sha256 } });
      return Response.json({ ok: true, fileKey, imageUrl: `/api/farmer-media?key=${encodeURIComponent(fileKey)}` });
    }

    if (submissionType === "farmer_evidence") {
      const evidenceType = String(form.get("evidenceType") ?? "").trim();
      const title = String(form.get("title") ?? "").trim();
      if (!farmerEvidenceTypes.has(evidenceType)) return Response.json({ error: "請選擇有效的永續證明項目" }, { status: 400 });
      if (!title || title.length > 160) return Response.json({ error: "永續證明名稱須為 1 至 160 個字" }, { status: 400 });

      const uploadId = crypto.randomUUID();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "farmer-evidence";
      const fileKey = `farmer-evidence/${session.profileId}/${uploadId}-${safeName}`;
      const uploads = await getUploadsBucket();
      await uploads.put(fileKey, bytes, { httpMetadata: { contentType: file.type }, customMetadata: { farmerId: session.profileId, evidenceType, sha256 } });
      try {
        const result = await db.prepare("INSERT INTO evidence (farmer_id, title, evidence_type, file_key, file_name, content_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)")
          .bind(session.profileId, title, evidenceType, fileKey, file.name, file.type, file.size).run();
        return Response.json({ ok: true, evidenceId: result.meta.last_row_id, status: "submitted", fileName: file.name });
      } catch (error) {
        await uploads.delete(fileKey);
        throw error;
      }
    }

    const actionType = String(form.get("actionType") ?? "");
    const note = String(form.get("note") ?? "").trim();
    const rule = actionRules[actionType];
    if (!rule) return Response.json({ error: "請選擇有效的綠色行動" }, { status: 400 });
    if (note.length > 1000) return Response.json({ error: "行動說明不可超過 1,000 個字" }, { status: 400 });
    const duplicate = await db.prepare("SELECT id, status FROM action_submissions WHERE consumer_id = ? AND action_type = ? AND file_sha256 = ?")
      .bind(session.profileId, actionType, sha256).first<{ id: string; status: string }>();
    if (duplicate) return Response.json({ ok: true, duplicate: true, submissionId: duplicate.id, status: duplicate.status });

    const submissionId = `ACTION-${crypto.randomUUID()}`;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "evidence";
    const fileKey = `action-proofs/${submissionId}/${safeName}`;
    const uploads = await getUploadsBucket();
    await uploads.put(fileKey, bytes, { httpMetadata: { contentType: file.type }, customMetadata: { submissionId, consumerId: session.profileId, actionType, sha256 } });
    try {
      await db.prepare("INSERT INTO action_submissions (id, consumer_id, action_type, title, note, reward_points, file_key, file_name, content_type, file_size, file_sha256) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(submissionId, session.profileId, actionType, rule.title, note || `${rule.title}證明`, rule.rewardPoints, fileKey, file.name, file.type, file.size, sha256).run();
    } catch (error) {
      await uploads.delete(fileKey);
      throw error;
    }
    return Response.json({ ok: true, submissionId, status: "pending" });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "上傳失敗" }, { status: error instanceof AuthError ? error.status : 400 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireAuth(request);
    const params = new URL(request.url).searchParams;
    const submissionId = params.get("submissionId") ?? "";
    const evidenceId = params.get("evidenceId") ?? "";
    const db = await getPlatformDb();
    const unrestrictedEvidence = session.role === "admin" || session.role === "institution";
    const submission = evidenceId
      ? await db.prepare(unrestrictedEvidence ? "SELECT file_key, file_name, content_type FROM evidence WHERE id = ?" : "SELECT file_key, file_name, content_type FROM evidence WHERE id = ? AND farmer_id = ?")
        .bind(...(unrestrictedEvidence ? [evidenceId] : [evidenceId, session.profileId])).first<{ file_key: string; file_name: string; content_type: string }>()
      : await db.prepare(session.role === "admin" ? "SELECT file_key, file_name, content_type FROM action_submissions WHERE id = ?" : "SELECT file_key, file_name, content_type FROM action_submissions WHERE id = ? AND consumer_id = ?")
        .bind(...(session.role === "admin" ? [submissionId] : [submissionId, session.profileId])).first<{ file_key: string; file_name: string; content_type: string }>();
    if (!submission) return new Response("找不到證明檔案", { status: 404 });
    const object = await (await getUploadsBucket()).get(submission.file_key);
    if (!object) return new Response("找不到證明檔案", { status: 404 });
    return new Response(object.body, { headers: { "content-type": submission.content_type, "content-disposition": `inline; filename*=UTF-8''${encodeURIComponent(submission.file_name)}`, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "讀取失敗", { status: error instanceof AuthError ? error.status : 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAuth(request, ["consumer"], true);
    const form = await request.formData();
    const submissionId = String(form.get("submissionId") ?? "").trim();
    const note = String(form.get("note") ?? "").trim();
    const fileValue = form.get("file");
    if (!submissionId) return Response.json({ error: "缺少行動證明編號" }, { status: 400 });
    const fileError = validateFile(fileValue);
    if (fileError) return Response.json({ error: fileError }, { status: 400 });
    if (note.length > 1000) return Response.json({ error: "行動說明不可超過 1,000 個字" }, { status: 400 });
    const file = fileValue as File;
    const { bytes, sha256 } = await inspectFile(file);

    const db = await getPlatformDb();
    const existing = await db.prepare("SELECT file_key, status FROM action_submissions WHERE id = ? AND consumer_id = ?").bind(submissionId, session.profileId).first<{ file_key: string; status: string }>();
    if (!existing) return Response.json({ error: "找不到指定的行動證明" }, { status: 404 });
    if (existing.status !== "pending") return Response.json({ error: "已完成審核的證明不可替換" }, { status: 409 });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "formal-evidence.pdf";
    const fileKey = `action-proofs/${submissionId}/${crypto.randomUUID()}-${safeName}`;
    const uploads = await getUploadsBucket();
    await uploads.put(fileKey, bytes, { httpMetadata: { contentType: file.type }, customMetadata: { submissionId, consumerId: session.profileId, replacement: "true", sha256 } });
    try {
      const statement = note
        ? db.prepare("UPDATE action_submissions SET file_key = ?, file_name = ?, content_type = ?, file_size = ?, file_sha256 = ?, note = ? WHERE id = ? AND consumer_id = ? AND status = 'pending'").bind(fileKey, file.name, file.type, file.size, sha256, note, submissionId, session.profileId)
        : db.prepare("UPDATE action_submissions SET file_key = ?, file_name = ?, content_type = ?, file_size = ?, file_sha256 = ? WHERE id = ? AND consumer_id = ? AND status = 'pending'").bind(fileKey, file.name, file.type, file.size, sha256, submissionId, session.profileId);
      await statement.run();
    } catch (error) {
      await uploads.delete(fileKey);
      throw error;
    }
    await uploads.delete(existing.file_key);
    return Response.json({ ok: true, submissionId, fileName: file.name, contentType: file.type });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "替換證明檔案失敗" }, { status: error instanceof AuthError ? error.status : 400 });
  }
}
