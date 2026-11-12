import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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

// "https://site/a/b/" -> "<distDir>/a/b/index.html"
export function pageFileFor(distDir, url) {
  const segments = new URL(url).pathname.split("/").filter(Boolean);
  return join(distDir, ...segments, "index.html");
}

// URL -> sha256 of its built HTML. URLs without a built file are skipped.
export function hashPages(distDir, urls, readFile = (p) => readFileSync(p, "utf8")) {
  return Object.fromEntries(
    urls.flatMap((url) => {
      try {
        return [[url, createHash("sha256").update(readFile(pageFileFor(distDir, url))).digest("hex")]];
      } catch (err) {
        if (err.code === "ENOENT") return [];
        throw err;
      }
    }),
  );
}

// New or changed URLs (in `next` order), then removed ones. No previous manifest means everything.
export function changedUrls(prev, next) {
  if (!prev) return Object.keys(next);
  const changed = Object.keys(next).filter((url) => prev[url] !== next[url]);
  const removed = Object.keys(prev).filter((url) => !(url in next));
  return [...changed, ...removed];
}
