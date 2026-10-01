import { request } from "./http.js";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export function parseSitemapUrls(xml) {
  return [...String(xml).matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map((m) => m[1]);
}

export async function submitIndexNow({ host, key, urlList, fetchImpl = fetch }) {
  if (!Array.isArray(urlList) || urlList.length === 0) throw new Error("indexnow: no URLs to submit");
  const body = { host, key, keyLocation: `https://${host}/${key}.txt`, urlList };
  const { status } = await request(INDEXNOW_ENDPOINT, { method: "POST", body, fetchImpl });
  return { status, count: urlList.length };
}
