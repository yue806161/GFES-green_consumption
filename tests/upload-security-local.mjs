import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const baseUrl = process.env.GFES_TEST_URL ?? "http://localhost:4310";

async function login(role, email, password) {
  const response = await fetch(`${baseUrl}/api/auth`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ role, email, password }) });
  const data = await response.json();
  assert.equal(response.status, 200);
  return { cookie: response.headers.get("set-cookie").split(";")[0], csrf: data.csrfToken };
}

const consumer = await login("consumer", "consumer@gfes.tw", "12345678");

function fakePdfForm(extra = {}) {
  const form = new FormData();
  form.set("actionType", "reusable_cup");
  form.set("note", "安全格式測試");
  form.set("file", new File(["this is not a pdf"], "spoofed.pdf", { type: "application/pdf" }));
  for (const [key, value] of Object.entries(extra)) form.set(key, value);
  return form;
}

const noAuth = await fetch(`${baseUrl}/api/uploads`, { method: "POST", body: fakePdfForm() });
assert.equal(noAuth.status, 401, "anonymous uploads must be rejected");

const roleEscalation = await fetch(`${baseUrl}/api/uploads`, {
  method: "POST",
  headers: { cookie: consumer.cookie, "x-gfes-csrf": consumer.csrf },
  body: fakePdfForm({ submissionType: "farmer_evidence", evidenceType: "友善耕作紀錄", title: "越權上傳" }),
});
assert.equal(roleEscalation.status, 403, "consumer must not upload farmer evidence");

const spoofed = await fetch(`${baseUrl}/api/uploads`, {
  method: "POST",
  headers: { cookie: consumer.cookie, "x-gfes-csrf": consumer.csrf },
  body: fakePdfForm(),
});
assert.equal(spoofed.status, 400, "MIME-spoofed content must be rejected");
assert.match((await spoofed.json()).error, /格式|內容/);

const crossAccountRead = await fetch(`${baseUrl}/api/uploads?submissionId=SAMPLE-ACTION-CUP-001`, { headers: { cookie: consumer.cookie } });
assert.equal(crossAccountRead.status, 404, "consumer must not read another account's proof");

const snapshot = await fetch(`${baseUrl}/api/platform`, { headers: { cookie: consumer.cookie } }).then((response) => response.json());
const reviewed = snapshot.actionSubmissions.find((item) => item.status !== "pending");
let reviewedReplacement = "not-applicable";
if (reviewed) {
  const bytes = await readFile(new URL("../public/documents/GFES_環保杯行動證明_正式範例.pdf", import.meta.url));
  const form = new FormData();
  form.set("submissionId", reviewed.id);
  form.set("file", new File([bytes], "reviewed-proof.pdf", { type: "application/pdf" }));
  const response = await fetch(`${baseUrl}/api/uploads`, { method: "PUT", headers: { cookie: consumer.cookie, "x-gfes-csrf": consumer.csrf }, body: form });
  assert.equal(response.status, 409, "reviewed evidence must be immutable");
  reviewedReplacement = "blocked";
}

console.log(JSON.stringify({ passed: true, checks: { anonymousUpload: "blocked", uploadRoleEscalation: "blocked", mimeSpoofing: "blocked", crossAccountRead: "blocked", reviewedReplacement } }, null, 2));
