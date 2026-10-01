import { createSign } from "node:crypto";
import { HttpError } from "./http.js";

export const TOKEN_URL = "https://oauth2.googleapis.com/token";
const TOKEN_LIFETIME_S = 3600;

const b64url = (input) => Buffer.from(input).toString("base64url");

/** Accepts the service-account key as raw JSON or as base64 of that JSON. */
export function parseServiceAccount(value) {
  const trimmed = String(value ?? "").trim();
  const text = trimmed.startsWith("{") ? trimmed : Buffer.from(trimmed, "base64").toString("utf8");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("GSC_SERVICE_ACCOUNT_JSON is neither valid JSON nor base64-encoded JSON");
  }
}

export function signJwt({ clientEmail, privateKey, scope, iat }) {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({ iss: clientEmail, scope, aud: TOKEN_URL, iat, exp: iat + TOKEN_LIFETIME_S }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  return `${header}.${claims}.${signer.sign(privateKey).toString("base64url")}`;
}

export async function getAccessToken({ serviceAccountJson, scope, fetchImpl = fetch, now = Date.now }) {
  const sa = typeof serviceAccountJson === "string" ? parseServiceAccount(serviceAccountJson) : serviceAccountJson;
  if (!sa?.client_email || !sa?.private_key) throw new Error("service account JSON must contain client_email and private_key");
  const assertion = signJwt({ clientEmail: sa.client_email, privateKey: sa.private_key, scope, iat: Math.floor(now() / 1000) });
  const body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }).toString();
  const res = await fetchImpl(TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  const text = await res.text();
  if (res.status >= 400) throw new HttpError("POST", TOKEN_URL, res.status, text);
  let json = null;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!json?.access_token) throw new Error(`token response has no access_token: ${text.slice(0, 200)}`);
  return json.access_token;
}
