import { getPlatformDb } from "./platform";

export type PlatformRole = "consumer" | "farmer" | "institution" | "admin";

export type AuthSession = {
  token: string;
  csrfToken: string;
  profileId: string;
  role: PlatformRole;
  expiresAt: string;
};

const SESSION_COOKIE = "gfes_session";
const SESSION_SECONDS = 8 * 60 * 60;

function parseCookie(request: Request, name: string) {
  const cookies = request.headers.get("cookie") ?? "";
  for (const item of cookies.split(";")) {
    const [key, ...value] = item.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createAuthSession(profileId: string, role: PlatformRole) {
  const db = await getPlatformDb();
  const token = randomToken();
  const tokenHash = await hashToken(token);
  const csrfToken = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000).toISOString();
  await db.batch([
    db.prepare("DELETE FROM auth_sessions WHERE expires_at <= CURRENT_TIMESTAMP"),
    db.prepare("INSERT INTO auth_sessions (token, csrf_token, profile_id, role, expires_at) VALUES (?, ?, ?, ?, ?)")
      .bind(tokenHash, csrfToken, profileId, role, expiresAt),
  ]);
  return { token, csrfToken, profileId, role, expiresAt } satisfies AuthSession;
}

export function sessionCookie(token: string, request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`;
}

export function expiredSessionCookie(request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export async function getAuthSession(request: Request): Promise<AuthSession | null> {
  const token = parseCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = await hashToken(token);
  const db = await getPlatformDb();
  const row = await db.prepare(`SELECT s.token, s.csrf_token, s.profile_id, s.role, s.expires_at
      FROM auth_sessions s
      LEFT JOIN account_controls ac ON ac.profile_id = s.profile_id
      WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP
        AND (s.role = 'admin' OR COALESCE(ac.status, 'missing') = 'active')`)
    .bind(tokenHash)
    .first<{ token: string; csrf_token: string; profile_id: string; role: PlatformRole; expires_at: string }>();
  if (!row || !["consumer", "farmer", "institution", "admin"].includes(row.role)) return null;
  return { token: row.token, csrfToken: row.csrf_token, profileId: row.profile_id, role: row.role, expiresAt: row.expires_at };
}

export async function deleteAuthSession(request: Request) {
  const token = parseCookie(request, SESSION_COOKIE);
  if (!token) return;
  const tokenHash = await hashToken(token);
  const db = await getPlatformDb();
  await db.prepare("DELETE FROM auth_sessions WHERE token = ?").bind(tokenHash).run();
}

export async function requireAuth(request: Request, roles?: PlatformRole[], csrf = false) {
  const session = await getAuthSession(request);
  if (!session) throw new AuthError("請先登入平台", 401);
  if (roles && !roles.includes(session.role)) throw new AuthError("此帳號沒有執行該操作的權限", 403);
  if (csrf && request.headers.get("x-gfes-csrf") !== session.csrfToken) throw new AuthError("安全驗證已失效，請重新登入", 403);
  return session;
}

export class AuthError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}
