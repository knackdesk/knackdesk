import { describe, it, expect, vi } from "vitest";
import { generateKeyPairSync, createVerify } from "node:crypto";
import { getAccessToken, parseServiceAccount } from "./google-auth.js";

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const sa = { client_email: "ci@proj.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }) };
const b64url = (s) => Buffer.from(s, "base64url");

function tokenFetch(status, body) {
  const calls = [];
  const fetchImpl = vi.fn(async (url, init) => {
    calls.push({ url, init });
    return { status, text: async () => (typeof body === "string" ? body : JSON.stringify(body)), headers: new Map() };
  });
  return { fetchImpl, calls };
}

describe("getAccessToken", () => {
  it("posts a signed RS256 JWT assertion and returns the access token", async () => {
    const { fetchImpl, calls } = tokenFetch(200, { access_token: "ya29.tok", expires_in: 3599 });
    const token = await getAccessToken({ serviceAccountJson: JSON.stringify(sa), scope: "https://www.googleapis.com/auth/webmasters", fetchImpl, now: () => 1_700_000_000_500 });
    expect(token).toBe("ya29.tok");
    expect(calls[0].url).toBe("https://oauth2.googleapis.com/token");
    expect(calls[0].init.method).toBe("POST");
    expect(calls[0].init.headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
    const form = new URLSearchParams(calls[0].init.body);
    expect(form.get("grant_type")).toBe("urn:ietf:params:oauth:grant-type:jwt-bearer");
    const [h, c, sig] = form.get("assertion").split(".");
    expect(JSON.parse(b64url(h))).toEqual({ alg: "RS256", typ: "JWT" });
    expect(JSON.parse(b64url(c))).toEqual({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/webmasters", aud: "https://oauth2.googleapis.com/token", iat: 1_700_000_000, exp: 1_700_003_600 });
    const v = createVerify("RSA-SHA256");
    v.update(`${h}.${c}`);
    expect(v.verify(publicKey, b64url(sig))).toBe(true);
  });

  it("throws with the response body on a 4xx", async () => {
    const { fetchImpl } = tokenFetch(400, '{"error":"invalid_grant"}');
    await expect(getAccessToken({ serviceAccountJson: JSON.stringify(sa), scope: "s", fetchImpl })).rejects.toThrow(/400.*invalid_grant/);
  });

  it("throws when the token response has no access_token", async () => {
    const { fetchImpl } = tokenFetch(200, {});
    await expect(getAccessToken({ serviceAccountJson: JSON.stringify(sa), scope: "s", fetchImpl })).rejects.toThrow(/access_token/);
  });

  it("rejects a service account missing fields", async () => {
    await expect(getAccessToken({ serviceAccountJson: "{}", scope: "s", fetchImpl: vi.fn() })).rejects.toThrow(/client_email/);
  });
});

describe("parseServiceAccount", () => {
  it("accepts raw JSON and base64-encoded JSON", () => {
    const raw = JSON.stringify(sa);
    expect(parseServiceAccount(raw).client_email).toBe(sa.client_email);
    expect(parseServiceAccount(Buffer.from(raw).toString("base64")).client_email).toBe(sa.client_email);
  });
  it("throws a clear error on garbage", () => {
    expect(() => parseServiceAccount("not-json")).toThrow(/GSC_SERVICE_ACCOUNT_JSON/);
  });
});
