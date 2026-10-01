import { describe, it, expect, vi } from "vitest";
import { submitIndexNow, parseSitemapUrls } from "./indexnow.js";

function mock(status, body = "") {
  const calls = [];
  const fetchImpl = vi.fn(async (url, init = {}) => {
    calls.push({ url: String(url), init, body: init.body ? JSON.parse(init.body) : undefined });
    return { status, text: async () => body, headers: new Map() };
  });
  return { fetchImpl, calls };
}

describe("submitIndexNow", () => {
  it("POSTs host, key, keyLocation and urlList to the IndexNow endpoint", async () => {
    const { fetchImpl, calls } = mock(200);
    const r = await submitIndexNow({ host: "knackdesk.com", key: "abc", urlList: ["https://knackdesk.com/"], fetchImpl });
    expect(r).toEqual({ status: 200, count: 1 });
    expect(calls[0].url).toBe("https://api.indexnow.org/indexnow");
    expect(calls[0].init.method).toBe("POST");
    expect(calls[0].init.headers["Content-Type"]).toMatch(/application\/json/);
    expect(calls[0].body).toEqual({ host: "knackdesk.com", key: "abc", keyLocation: "https://knackdesk.com/abc.txt", urlList: ["https://knackdesk.com/"] });
  });
  it("treats 202 as ok", async () => {
    const { fetchImpl } = mock(202);
    expect((await submitIndexNow({ host: "h.com", key: "k", urlList: ["https://h.com/a"], fetchImpl })).status).toBe(202);
  });
  it("throws on 4xx with the body", async () => {
    const { fetchImpl } = mock(403, "key not valid");
    await expect(submitIndexNow({ host: "h.com", key: "k", urlList: ["https://h.com/a"], fetchImpl })).rejects.toThrow(/403.*key not valid/);
  });
  it("refuses an empty url list", async () => {
    await expect(submitIndexNow({ host: "h.com", key: "k", urlList: [], fetchImpl: vi.fn() })).rejects.toThrow(/no URLs/);
  });
});

describe("parseSitemapUrls", () => {
  it("extracts loc entries", () => {
    const xml = "<urlset><url><loc>https://a.com/</loc></url><url><loc> https://a.com/b </loc></url></urlset>";
    expect(parseSitemapUrls(xml)).toEqual(["https://a.com/", "https://a.com/b"]);
  });
});
