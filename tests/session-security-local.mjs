import assert from "node:assert/strict";

const baseUrl = process.env.GFES_TEST_URL ?? "http://localhost:4310";

async function login(role, email, password) {
  const response = await fetch(`${baseUrl}/api/auth`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ role, email, password }) });
  const data = await response.json();
  assert.equal(response.status, 200);
  return { cookie: response.headers.get("set-cookie").split(";")[0], csrf: data.csrfToken };
}

async function adminUpdate(admin, status) {
  return fetch(`${baseUrl}/api/platform`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: admin.cookie, "x-gfes-csrf": admin.csrf },
    body: JSON.stringify({ action: "admin_update_account", profileId: "consumer-001", displayName: "林子晴", username: "consumer001", email: "consumer@gfes.tw", city: "台北市", district: "大安區", status, pointAdjustment: 0, reason: "安全測試帳號狀態" }),
  });
}

const [consumer, admin] = await Promise.all([
  login("consumer", "consumer@gfes.tw", "12345678"),
  login("admin", "admin001", "13245678"),
]);

assert.equal((await adminUpdate(admin, "suspended")).status, 200);
const suspendedRequest = await fetch(`${baseUrl}/api/platform`, { headers: { cookie: consumer.cookie } });
assert.equal(suspendedRequest.status, 401, "an existing session must be revoked when the account is suspended");
assert.equal((await adminUpdate(admin, "active")).status, 200);

const relogin = await login("consumer", "consumer@gfes.tw", "12345678");
const logout = await fetch(`${baseUrl}/api/auth`, { method: "DELETE", headers: { cookie: relogin.cookie } });
assert.equal(logout.status, 200);
const afterLogout = await fetch(`${baseUrl}/api/platform`, { headers: { cookie: relogin.cookie } });
assert.equal(afterLogout.status, 401, "a logged-out session must not be reusable");

console.log(JSON.stringify({ passed: true, checks: { suspendedSession: "revoked", loggedOutSession: "revoked" } }, null, 2));
