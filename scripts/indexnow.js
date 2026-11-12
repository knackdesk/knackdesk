// Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver, Yep).
//   node scripts/indexnow.js --urls-file indexnow-urls.txt   only the listed URLs (deploys)
//   node scripts/indexnow.js                                  every URL in the sitemap (manual, site-wide change)
import { existsSync, readFileSync } from "node:fs";
import { loadDotEnv } from "./lib/env.js";
import { parseSitemapUrls, submitIndexNow } from "./lib/indexnow.js";

const HOST = "knackdesk.com";
const LOCAL_SITEMAP = "dist/sitemap.xml";

async function readSitemap() {
  if (existsSync(LOCAL_SITEMAP)) return { urls: parseSitemapUrls(readFileSync(LOCAL_SITEMAP, "utf8")), source: LOCAL_SITEMAP };
  const url = `https://${HOST}/sitemap.xml`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return { urls: parseSitemapUrls(await res.text()), source: url };
}

function readUrlsFile(path) {
  if (!existsSync(path)) throw new Error(`urls file not found: ${path}`);
  const urls = readFileSync(path, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
  const offHost = urls.filter((u) => new URL(u).host !== HOST);
  if (offHost.length) throw new Error(`urls not on ${HOST}: ${offHost.join(", ")}`);
  return { urls, source: path };
}

function urlsFileArg(argv) {
  const i = argv.indexOf("--urls-file");
  if (i === -1) return null;
  if (!argv[i + 1]) throw new Error("--urls-file requires a path");
  return argv[i + 1];
}

try {
  await loadDotEnv();
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    console.log("indexnow: skipped: INDEXNOW_KEY not set");
    process.exit(0);
  }
  const file = urlsFileArg(process.argv.slice(2));
  const { urls, source } = file ? readUrlsFile(file) : await readSitemap();
  if (urls.length === 0) {
    console.log(`indexnow: skipped: no changed urls in ${source}`);
    process.exit(0);
  }
  const { status, count } = await submitIndexNow({ host: HOST, key, urlList: urls });
  console.log(`indexnow: submitted ${count} urls from ${source}, status ${status}`);
} catch (err) {
  console.error(`indexnow: error: ${err.message}`);
  process.exit(1);
}
