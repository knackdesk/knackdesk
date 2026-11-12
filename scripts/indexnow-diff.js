// Run after `npm run build`, before deploying dist/.
// Writes dist/indexnow-hashes.json (published, so the next deploy can diff against it)
// and indexnow-urls.txt: the pages that are new, changed or removed versus the live site.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { changedUrls, hashPages, parseSitemapUrls } from "./lib/indexnow.js";

const HOST = "knackdesk.com";
const DIST = "dist";
const MANIFEST = "indexnow-hashes.json";
const OUT = process.argv[2] || "indexnow-urls.txt";

async function fetchLiveManifest() {
  const url = `https://${HOST}/${MANIFEST}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (res.status === 404) {
      console.log(`indexnow-diff: no live manifest at ${url}, treating every page as new`);
      return null;
    }
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`indexnow-diff: warning: could not read live manifest (${err.message}), treating every page as new`);
    return null;
  }
}

try {
  const urls = parseSitemapUrls(readFileSync(join(DIST, "sitemap.xml"), "utf8"));
  const next = hashPages(DIST, urls);
  writeFileSync(join(DIST, MANIFEST), `${JSON.stringify(next, null, 2)}\n`);
  const changed = changedUrls(await fetchLiveManifest(), next);
  writeFileSync(OUT, changed.length ? `${changed.join("\n")}\n` : "");
  console.log(`indexnow-diff: ${changed.length} of ${urls.length} urls to submit -> ${OUT}`);
  for (const u of changed.slice(0, 50)) console.log(`  ${u}`);
} catch (err) {
  console.error(`indexnow-diff: error: ${err.message}`);
  process.exit(1);
}
