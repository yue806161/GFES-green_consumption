// Cloudflare Workers currently caps Web Crypto PBKDF2 at 100,000 iterations.
// Keep the former value as a verification-only fallback so existing local
// accounts created before the Cloudflare deployment continue to work.
const PASSWORD_ITERATIONS = 100_000;
const LEGACY_PASSWORD_ITERATIONS = 120_000;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value: string) {
  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) return new Uint8Array();
  return new Uint8Array(value.match(/.{2}/g)?.map((item) => Number.parseInt(item, 16)) ?? []);
}

async function derivePassword(password: string, salt: Uint8Array, iterations = PASSWORD_ITERATIONS) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer, iterations },
    key,
    256,
  );
  return bytesToHex(new Uint8Array(bits));
}

export async function createPasswordCredential(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { passwordHash: await derivePassword(password, salt), passwordSalt: bytesToHex(salt) };
}

export async function verifyPassword(password: string, passwordHash: string | null, passwordSalt: string | null) {
  if (!passwordHash || !passwordSalt) return false;
  const expected = hexToBytes(passwordHash);
  const salt = hexToBytes(passwordSalt);
  if (expected.length === 0 || salt.length === 0) return false;

  for (const iterations of [PASSWORD_ITERATIONS, LEGACY_PASSWORD_ITERATIONS]) {
    try {
      const actual = hexToBytes(await derivePassword(password, salt, iterations));
      if (expected.length !== actual.length) continue;
      let difference = 0;
      for (let index = 0; index < expected.length; index += 1) difference |= expected[index] ^ actual[index];
      if (difference === 0) return true;
    } catch {
      // Cloudflare rejects the legacy count. New credentials always use the
      // supported count, so an unavailable legacy fallback is safe to skip.
    }
  }

  return false;
}

export async function hashOpaqueToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return bytesToHex(new Uint8Array(digest));
}
