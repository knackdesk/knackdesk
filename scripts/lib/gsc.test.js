import { describe, it, expect, vi } from "vitest";
import { submitSitemap, listSitemaps } from "./gsc.js";

function mock(status, body = "") {
  const calls = [];
  const fetchImpl = vi.fn(async (url, init = {}) => {
    calls.push({ url: String(url), init });
    return { status, text: async () => (typeof body === "string" ? body : JSON.stringify(body)), headers: new Map() };
  });
  return { fetchImpl, calls };
}

const COLLECTION = "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aknackdesk.com/sitemaps";

describe("submitSitemap", () => {
  it("PUTs the encoded sitemap URL with bearer auth", async () => {
    const { fetchImpl, calls } = mock(204);
    const r = await submitSitemap({ accessToken: "tok", fetchImpl });
    expect(r).toEqual({ status: 204 });
    expect(calls[0].url).toBe(`${COLLECTION}/https%3A%2F%2Fknackdesk.com%2Fsitemap.xml`);
    expect(calls[0].init.method).toBe("PUT");
    expect(calls[0].init.headers.Authorization).toBe("Bearer tok");
  });
  it("accepts 200", async () => {
    const { fetchImpl } = mock(200, "{}");
    expect((await submitSitemap({ accessToken: "t", siteUrl: "https://x.com/", sitemapUrl: "https://x.com/s.xml", fetchImpl })).status).toBe(200);
  });
  it("surfaces API errors", async () => {
    const { fetchImpl } = mock(403, '{"error":{"message":"User does not have sufficient permission"}}');
    await expect(submitSitemap({ accessToken: "t", fetchImpl })).rejects.toThrow(/403.*sufficient permission/);
  });
});

describe("listSitemaps", () => {
  it("GETs the collection and returns parsed JSON", async () => {
    const body = { sitemap: [{ path: "https://knackdesk.com/sitemap.xml", lastSubmitted: "2026-10-01", isPending: false, errors: "0", warnings: "0" }] };
    const { fetchImpl, calls } = mock(200, body);
    expect(await listSitemaps({ accessToken: "tok", fetchImpl })).toEqual(body);
    expect(calls[0].url).toBe(COLLECTION);
    expect(calls[0].init.method).toBe("GET");
    expect(calls[0].init.headers.Authorization).toBe("Bearer tok");
  });
  it("surfaces API errors", async () => {
    const { fetchImpl } = mock(401, "unauthorized");
    await expect(listSitemaps({ accessToken: "t", fetchImpl })).rejects.toThrow(/401/);
  });
});
