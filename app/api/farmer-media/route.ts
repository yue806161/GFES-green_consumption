import { AuthError, requireAuth } from "../../../db/auth";
import { getPlatformDb } from "../../../db/platform";

async function getUploadsBucket() {
  const { env } = await import("cloudflare:workers");
  const uploads = (env as unknown as { UPLOADS?: R2Bucket }).UPLOADS;
  if (!uploads) throw new Error("圖片儲存服務尚未啟用");
  return uploads;
}

export async function GET(request: Request) {
  try {
    const key = new URL(request.url).searchParams.get("key")?.trim() ?? "";
    if (!key.startsWith("farmer-media/") || key.includes("..")) return new Response("無效的圖片識別碼", { status: 400 });
    const db = await getPlatformDb();
    const published = await db.prepare(`SELECT farmer_id FROM farmer_stories WHERE image_key = ? AND status = 'published'
      UNION SELECT farmer_id FROM farmer_news WHERE image_key = ? AND status = 'published' LIMIT 1`).bind(key, key).first<{ farmer_id: string }>();
    if (!published) {
      const session = await requireAuth(request, ["farmer", "admin"]);
      const ownerId = key.split("/")[1] ?? "";
      if (session.role !== "admin" && ownerId !== session.profileId) return new Response("無權讀取此圖片", { status: 403 });
    }
    const object = await (await getUploadsBucket()).get(key);
    if (!object) return new Response("找不到圖片", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("cache-control", published ? "public, max-age=3600" : "private, no-store");
    headers.set("x-content-type-options", "nosniff");
    return new Response(object.body, { headers });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "圖片讀取失敗", { status: error instanceof AuthError ? error.status : 400 });
  }
}
