export class HttpError extends Error {
  constructor(method, url, status, body) {
    super(`${method} ${url} -> ${status}: ${body}`);
    this.status = status;
    this.body = body;
  }
}

export async function request(url, { method = "GET", headers = {}, body, raw = false, fetchImpl = fetch } = {}) {
  const init = { method, headers: { ...headers } };
  if (body !== undefined) {
    init.body = raw ? body : JSON.stringify(body);
    if (!raw) init.headers["Content-Type"] = "application/json";
  }
  const res = await fetchImpl(url, init);
  const text = await res.text();
  if (res.status >= 400) throw new HttpError(method, url, res.status, text);
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  return { status: res.status, json, headers: res.headers };
}
