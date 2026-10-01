import { describe, it, expect } from "vitest";
import { searchAnalytics, analyticsWindow } from "./gsc.js";

describe("searchAnalytics", () => {
  it("posts a search analytics query for the window and dimension and returns rows", async () => {
    const calls = [];
    const fetchImpl = async (url, init) => { calls.push({ url, init }); return { status: 200, text: async () => JSON.stringify({ rows: [{ keys: ["pay raise calculator"], clicks: 3, impressions: 40, ctr: 0.075, position: 8.2 }] }) }; };
    const rows = await searchAnalytics({ accessToken: "t", dimension: "query", startDate: "2026-09-04", endDate: "2026-10-01", rowLimit: 25, fetchImpl });
    expect(calls[0].url).toBe("https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aknackdesk.com/searchAnalytics/query");
    expect(calls[0].init.method).toBe("POST");
    const body = JSON.parse(calls[0].init.body);
    expect(body).toEqual({ startDate: "2026-09-04", endDate: "2026-10-01", dimensions: ["query"], rowLimit: 25 });
    expect(rows).toEqual([{ key: "pay raise calculator", clicks: 3, impressions: 40, ctr: 0.075, position: 8.2 }]);
  });
  it("returns an empty list when the property has no rows yet", async () => {
    const fetchImpl = async () => ({ status: 200, text: async () => "{}" });
    expect(await searchAnalytics({ accessToken: "t", dimension: "page", startDate: "2026-09-04", endDate: "2026-10-01", fetchImpl })).toEqual([]);
  });
});

describe("analyticsWindow", () => {
  it("ends three days ago (Search Console lag) and spans 28 days", () => {
    expect(analyticsWindow(new Date("2026-10-01T12:00:00Z"), 28)).toEqual({ startDate: "2026-09-01", endDate: "2026-09-28" });
  });
});
