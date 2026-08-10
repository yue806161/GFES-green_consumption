import { createAuthSession, deleteAuthSession, expiredSessionCookie, getAuthSession, PlatformRole, sessionCookie } from "../../../db/auth";
import { verifyPassword } from "../../../db/credentials";
import { getPlatformDb } from "../../../db/platform";

function safeAttemptKey(request: Request, identifier: string) {
  const forwarded = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  return `${forwarded.trim().slice(0, 64)}:${identifier.slice(0, 120)}`;
}

export async function GET(request: Request) {
  const session = await getAuthSession(request);
  if (!session) return Response.json({ authenticated: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  return Response.json({ authenticated: true, role: session.role, csrfToken: session.csrfToken, expiresAt: session.expiresAt }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const role = String(body.role ?? "") as PlatformRole;
    const identifier = String(body.email ?? body.identifier ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!["consumer", "farmer", "institution", "admin"].includes(role) || !identifier || password.length > 128) {
      return Response.json({ error: "請輸入有效的登入角色、帳號與密碼。" }, { status: 400 });
    }

    const db = await getPlatformDb();
    const attemptKey = safeAttemptKey(request, identifier);
    const attempt = await db.prepare("SELECT failures, blocked_until FROM auth_login_attempts WHERE attempt_key = ?").bind(attemptKey).first<{ failures: number; blocked_until: string | null }>();
    if (attempt?.blocked_until && Date.parse(attempt.blocked_until) > Date.now()) {
      return Response.json({ error: "登入失敗次數過多，請稍後五分鐘再試。" }, { status: 429 });
    }

    const account = role === "admin"
      ? await db.prepare(`SELECT profile_id, email, status, password_hash, password_salt
          FROM account_controls WHERE profile_id = 'platform-admin' AND (lower(email) = ? OR lower(username) = ?)`)
        .bind(identifier, identifier).first<{ profile_id: string; email: string; status: string; password_hash: string | null; password_salt: string | null }>()
      : await db.prepare(`SELECT ac.profile_id, ac.email, ac.status, ac.password_hash, ac.password_salt
          FROM account_controls ac JOIN profiles p ON p.id = ac.profile_id
          WHERE (lower(ac.email) = ? OR lower(ac.username) = ?) AND p.role = ?`)
        .bind(identifier, identifier, role).first<{ profile_id: string; email: string; status: string; password_hash: string | null; password_salt: string | null }>();

    const valid = Boolean(account && await verifyPassword(password, account.password_hash, account.password_salt));
    if (!valid) {
      const failures = (attempt?.failures ?? 0) + 1;
      const blockedUntil = failures >= 5 ? new Date(Date.now() + 5 * 60 * 1000).toISOString() : null;
      await db.prepare("INSERT INTO auth_login_attempts (attempt_key, failures, window_started_at, blocked_until) VALUES (?, ?, CURRENT_TIMESTAMP, ?) ON CONFLICT(attempt_key) DO UPDATE SET failures = ?, blocked_until = ?")
        .bind(attemptKey, failures, blockedUntil, failures, blockedUntil).run();
      return Response.json({ error: "帳號、密碼或角色不正確。" }, { status: 401 });
    }
    if (account?.status !== "active") {
      return Response.json({ error: account?.status === "suspended"
        ? "此帳號已被停權，請聯絡平台管理員。"
        : account?.status === "pending"
          ? "註冊申請仍在審核中，管理員審核通過後才能登入，預計需要 1～3 個工作天。"
          : "此帳號目前無法登入，請聯絡平台管理員。" }, { status: 403 });
    }

    await db.prepare("DELETE FROM auth_login_attempts WHERE attempt_key = ?").bind(attemptKey).run();
    const session = await createAuthSession(account.profile_id, role);
    return Response.json({ authenticated: true, role, csrfToken: session.csrfToken, expiresAt: session.expiresAt }, {
      headers: { "Set-Cookie": sessionCookie(session.token, request), "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "登入資料格式不正確。" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await deleteAuthSession(request);
  return Response.json({ ok: true }, { headers: { "Set-Cookie": expiredSessionCookie(request), "Cache-Control": "no-store" } });
}
