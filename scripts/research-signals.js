/**
 * Prints the demand signals we own, for the research step at the start of every build turn:
 *  1. Search Console: top queries and pages (last 28 days, 3-day lag)
 *  2. Cloudflare Web Analytics: top pages by page views (last 28 days)
 *  3. Polar: units and gross per kit from pipeline/LEDGER.md
 * Every section degrades to a clear "no data yet" line instead of failing.
 */
import { readFile } from "node:fs/promises";
import { loadDotEnv } from "./lib/env.js";
import { getAccessToken } from "./lib/google-auth.js";
import { searchAnalytics, analyticsWindow } from "./lib/gsc.js";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const pad = (s, n) => String(s).padEnd(n).slice(0, n);

async function gscSection() {
  const sa = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (!sa) return console.log("search console: skipped (GSC_SERVICE_ACCOUNT_JSON not set)");
  const { startDate, endDate } = analyticsWindow();
  const accessToken = await getAccessToken({ serviceAccountJson: sa, scope: SCOPE });
  for (const dimension of ["query", "page"]) {
    const rows = await searchAnalytics({ accessToken, dimension, startDate, endDate, rowLimit: 25 });
    console.log(`\nsearch console ${dimension}s ${startDate}..${endDate}: ${rows.length ? "" : "no data yet"}`);
    if (rows.length) console.log(`  ${pad(dimension, 60)} clicks  impr   ctr    pos`);
    for (const r of rows) console.log(`  ${pad(r.key.replace("https://knackdesk.com", ""), 60)} ${pad(r.clicks, 6)} ${pad(r.impressions, 6)} ${pad((r.ctr * 100).toFixed(1) + "%", 6)} ${r.position.toFixed(1)}`);
  }
}

async function cloudflareSection() {
  const token = process.env.CLOUDFLARE_API_TOKEN, account = process.env.CLOUDFLARE_ACCOUNT_ID, site = process.env.CLOUDFLARE_WEB_ANALYTICS_SITE_TAG;
  if (!token || !account) return console.log("\ncloudflare analytics: skipped (CLOUDFLARE_API_TOKEN/ACCOUNT_ID not set)");
  if (!site) return console.log("\ncloudflare analytics: skipped (CLOUDFLARE_WEB_ANALYTICS_SITE_TAG not set; find it under Analytics & Logs > Web Analytics > site > Manage site)");
  const since = new Date(Date.now() - 28 * 86400000).toISOString();
  const query = `{ viewer { accounts(filter:{accountTag:"${account}"}) { rumPageloadEventsAdaptiveGroups(limit:25, filter:{siteTag:"${site}", datetime_geq:"${since}"}, orderBy:[count_DESC]) { count dimensions { requestPath } } } } }`;
  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
  const json = await res.json();
  if (json.errors?.length) return console.log(`\ncloudflare analytics: error: ${json.errors[0].message}`);
  const rows = json.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups ?? [];
  console.log(`\ncloudflare page views, last 28 days: ${rows.length ? "" : "no data yet"}`);
  for (const r of rows) console.log(`  ${pad(r.dimensions.requestPath, 60)} ${r.count}`);
}

async function polarSection() {
  const text = await readFile(new URL("../pipeline/LEDGER.md", import.meta.url), "utf8");
  const rows = text.split("\n").filter((l) => l.startsWith("| ") && !l.startsWith("| slug") && !l.startsWith("|---")).map((l) => l.split("|").map((c) => c.trim()));
  console.log("\npolar kits (ledger):");
  console.log(`  ${pad("slug", 36)} price  units  gross`);
  for (const r of rows) console.log(`  ${pad(r[1], 36)} ${pad(r[5], 6)} ${pad(r[6], 6)} ${r[7]}`);
}

try {
  await loadDotEnv();
  await gscSection();
  await cloudflareSection();
  await polarSection();
} catch (err) {
  console.error(`research: error: ${err.message}`);
  process.exit(1);
}
