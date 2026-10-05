/**
 * Indexing status of every sitemap URL via the Search Console URL Inspection API.
 * Usage: node scripts/index-report.js [--limit N] [--json]
 */
import { loadDotEnv } from "./lib/env.js";
import { getAccessToken } from "./lib/google-auth.js";
import { parseSitemapUrls } from "./lib/indexing-api.js";
import { inspectUrl, summarizeInspections } from "./lib/url-inspection.js";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : dflt; };
const limit = Number(arg("--limit", "500"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function runIndexReport({ log = console.log } = {}) {
  await loadDotEnv();
  const sa = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (!sa) { log("index report: skipped (GSC_SERVICE_ACCOUNT_JSON not set)"); return null; }
  const urls = parseSitemapUrls(await (await fetch("https://knackdesk.com/sitemap.xml")).text()).slice(0, limit);
  const accessToken = await getAccessToken({ serviceAccountJson: sa, scope: SCOPE });
  const rows = [];
  const started = Date.now();
  for (const [i, url] of urls.entries()) {
    try { rows.push(await inspectUrl({ accessToken, url })); } catch (err) { rows.push({ url, verdict: "ERROR", coverage: String(err.name === "AbortError" ? "timeout" : err.message).slice(0, 80) }); }
    if ((i + 1) % 10 === 0 || i + 1 === urls.length) log(`  inspected ${i + 1}/${urls.length} (${Math.round((Date.now() - started) / 1000)}s)`);
    await sleep(120);
  }
  const s = summarizeInspections(rows);
  log(`\nindex coverage (URL Inspection, ${s.total} sitemap urls): ${s.indexed} indexed`);
  for (const [state, n] of Object.entries(s.byCoverage).sort((a, b) => b[1] - a[1])) log(`  ${String(n).padStart(3)}  ${state}`);
  if (s.notIndexed.length) { log(`  not indexed (${s.notIndexed.length}):`); for (const r of s.notIndexed.slice(0, 40)) log(`    ${r.url.replace("https://knackdesk.com", "")}  ${r.coverage}${r.lastCrawl ? "  crawled " + r.lastCrawl.slice(0, 10) : ""}`); }
  if (s.richProblems.length) { log(`  rich result problems (${s.richProblems.length}):`); for (const r of s.richProblems) log(`    ${r.url.replace("https://knackdesk.com", "")}  ${r.richVerdict} ${r.richIssues} issue(s)`); }
  return { rows, summary: s };
}

if (process.argv[1] && process.argv[1].endsWith("index-report.js")) {
  try {
    const result = await runIndexReport();
    if (process.argv.includes("--json") && result) console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) { console.error(`index report: error: ${err.message}`); process.exit(1); }
}
