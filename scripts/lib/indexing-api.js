import { request } from "./http.js";

export const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const PUBLISH_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";

export function parseSitemapUrls(xml) {
  return [...String(xml).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

/** Publish one URL_UPDATED notification. Throws HttpError on non-2xx (403 when the API is not enabled or not permitted, 429 on quota). */
export async function publishUrl({ accessToken, url, fetchImpl = fetch }) {
  const { json } = await request(PUBLISH_URL, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body: { url, type: "URL_UPDATED" }, fetchImpl });
  return json;
}
