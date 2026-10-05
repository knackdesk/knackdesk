import { request } from "./http.js";
import { DEFAULT_SITE_URL } from "./gsc.js";

const INSPECT_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";

/** One URL Inspection call (quota: 2,000 per property per day, 600 per minute). */
export async function inspectUrl({ accessToken, url, siteUrl = DEFAULT_SITE_URL, fetchImpl = fetch }) {
  const { json } = await request(INSPECT_URL, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body: { inspectionUrl: url, siteUrl }, fetchImpl });
  const idx = json?.inspectionResult?.indexStatusResult ?? {};
  const rich = json?.inspectionResult?.richResultsResult ?? null;
  const richIssues = rich ? (rich.detectedItems ?? []).reduce((n, d) => n + (d.items ?? []).reduce((m, i) => m + (i.issues ?? []).length, 0), 0) : 0;
  return { url, verdict: idx.verdict ?? "UNKNOWN", coverage: idx.coverageState ?? "", lastCrawl: idx.lastCrawlTime ?? null, fetch: idx.pageFetchState ?? null, robots: idx.robotsTxtState ?? null, richVerdict: rich?.verdict ?? null, richIssues };
}

export function summarizeInspections(rows) {
  const byCoverage = {};
  for (const r of rows) byCoverage[r.coverage || "(no state)"] = (byCoverage[r.coverage || "(no state)"] || 0) + 1;
  const isIndexed = (r) => r.verdict === "PASS";
  return { total: rows.length, indexed: rows.filter(isIndexed).length, byCoverage, notIndexed: rows.filter((r) => !isIndexed(r)), richProblems: rows.filter((r) => r.richVerdict === "FAIL" || (r.richIssues ?? 0) > 0) };
}
