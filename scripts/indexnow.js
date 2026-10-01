import { existsSync, readFileSync } from "node:fs";
import { loadDotEnv } from "./lib/env.js";
import { parseSitemapUrls, submitIndexNow } from "./lib/indexnow.js";

const HOST = "knackdesk.com";
const LOCAL_SITEMAP = "dist/sitemap.xml";

async function readSitemap() {
  if (existsSync(LOCAL_SITEMAP)) return { xml: readFileSync(LOCAL_SITEMAP, "utf8"), source: LOCAL_SITEMAP };
  const url = `https://${HOST}/sitemap.xml`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return { xml: await res.text(), source: url };
}

try {
  await loadDotEnv();
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    console.log("indexnow: skipped: INDEXNOW_KEY not set");
    process.exit(0);
  }
  const { xml, source } = await readSitemap();
  const { status, count } = await submitIndexNow({ host: HOST, key, urlList: parseSitemapUrls(xml) });
  console.log(`indexnow: submitted ${count} urls from ${source}, status ${status}`);
} catch (err) {
  console.error(`indexnow: error: ${err.message}`);
  process.exit(1);
}
