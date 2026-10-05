import { describe, it, expect } from "vitest";
import { inspectUrl, summarizeInspections } from "./url-inspection.js";

describe("inspectUrl", () => {
  it("posts the inspection request for the property and returns the flattened result", async () => {
    const calls = [];
    const fetchImpl = async (url, init) => { calls.push({ url, init }); return { status: 200, text: async () => JSON.stringify({ inspectionResult: { indexStatusResult: { verdict: "PASS", coverageState: "Submitted and indexed", lastCrawlTime: "2026-10-04T08:00:00Z", robotsTxtState: "ALLOWED", indexingState: "INDEXING_ALLOWED", pageFetchState: "SUCCESSFUL" }, richResultsResult: { verdict: "PASS", detectedItems: [{ richResultType: "FAQ", items: [{ name: "x", issues: [] }] }] } } }) }; };
    const r = await inspectUrl({ accessToken: "t", url: "https://knackdesk.com/kits/", fetchImpl });
    expect(calls[0].url).toBe("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect");
    expect(JSON.parse(calls[0].init.body)).toEqual({ inspectionUrl: "https://knackdesk.com/kits/", siteUrl: "sc-domain:knackdesk.com" });
    expect(r).toEqual({ url: "https://knackdesk.com/kits/", verdict: "PASS", coverage: "Submitted and indexed", lastCrawl: "2026-10-04T08:00:00Z", fetch: "SUCCESSFUL", robots: "ALLOWED", richVerdict: "PASS", richIssues: 0 });
  });
  it("treats an unknown URL as not indexed", async () => {
    const fetchImpl = async () => ({ status: 200, text: async () => JSON.stringify({ inspectionResult: { indexStatusResult: { verdict: "NEUTRAL", coverageState: "URL is unknown to Google" } } }) });
    const r = await inspectUrl({ accessToken: "t", url: "https://knackdesk.com/x/", fetchImpl });
    expect(r.coverage).toBe("URL is unknown to Google"); expect(r.lastCrawl).toBeNull(); expect(r.richVerdict).toBeNull();
  });
});

describe("summarizeInspections", () => {
  it("counts coverage states and lists the non-indexed urls", () => {
    const s = summarizeInspections([
      { url: "a", verdict: "PASS", coverage: "Submitted and indexed" },
      { url: "b", verdict: "NEUTRAL", coverage: "Discovered - currently not indexed" },
      { url: "c", verdict: "NEUTRAL", coverage: "URL is unknown to Google" },
      { url: "d", verdict: "PASS", coverage: "Submitted and indexed", richVerdict: "FAIL", richIssues: 2 },
    ]);
    expect(s.total).toBe(4); expect(s.indexed).toBe(2);
    expect(s.byCoverage).toEqual({ "Submitted and indexed": 2, "Discovered - currently not indexed": 1, "URL is unknown to Google": 1 });
    expect(s.notIndexed.map((r) => r.url)).toEqual(["b", "c"]);
    expect(s.richProblems.map((r) => r.url)).toEqual(["d"]);
  });
});
