/**
 * Publish every URL in the live sitemap to Google's Indexing API (URL_UPDATED).
 * Usage: node scripts/google-index.js [--sitemap URL] [--limit N] [--dry-run]
 * Default quota is 200 publish requests per day per project; the script stops at --limit (default 190).
 * Needs GSC_SERVICE_ACCOUNT_JSON in .env, the Indexing API enabled on the project, and the service account as an owner of the Search Console property.
 * Note: Google's terms restrict this API to JobPosting and BroadcastEvent pages; run at the owner's decision.
 */
import { loadDotEnv } from "./lib/env.js";
import { getAccessToken } from "./lib/google-auth.js";
import { parseSitemapUrls, publishUrl, INDEXING_SCOPE } from "./lib/indexing-api.js";

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : dflt; };
const sitemapUrl = arg("--sitemap", "https://knackdesk.com/sitemap.xml");
const limit = Number(arg("--limit", "190"));
const dryRun = process.argv.includes("--dry-run");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  await loadDotEnv();
  const sa = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (!sa) { console.error("google-index: GSC_SERVICE_ACCOUNT_JSON not set"); process.exit(1); }
  const xml = await (await fetch(sitemapUrl)).text();
  const urls = parseSitemapUrls(xml);
  console.log(`google-index: ${urls.length} urls in ${sitemapUrl}; limit ${limit}${dryRun ? "; dry run" : ""}`);
  if (dryRun) { for (const u of urls.slice(0, limit)) console.log(`  would publish ${u}`); process.exit(0); }
  const accessToken = await getAccessToken({ serviceAccountJson: sa, scope: INDEXING_SCOPE });
  let ok = 0, failed = 0;
  for (const url of urls.slice(0, limit)) {
    try {
      const r = await publishUrl({ accessToken, url });
      ok += 1; console.log(`  ok   ${url}  ${r?.urlNotificationMetadata?.latestUpdate?.notifyTime ?? ""}`);
    } catch (err) {
      failed += 1; console.log(`  FAIL ${url}  ${String(err.message).slice(0, 200)}`);
      if (/\b(403|429)\b/.test(err.message)) { console.log("google-index: stopping on 403/429 (API not enabled, no permission, or quota exhausted)"); break; }
    }
    await sleep(350);
  }
  console.log(`google-index: done, ${ok} published, ${failed} failed`);
  process.exit(failed && !ok ? 1 : 0);
} catch (err) {
  console.error(`google-index: error: ${err.message}`);
  process.exit(1);
}
