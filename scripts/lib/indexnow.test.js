import { describe, it, expect, vi } from "vitest";
import { submitIndexNow, parseSitemapUrls, pageFileFor, hashPages, changedUrls } from "./indexnow.js";

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

describe("pageFileFor", () => {
  it("maps a site URL to its index.html under dist", () => {
    expect(pageFileFor("dist", "https://knackdesk.com/")).toBe("dist/index.html");
    expect(pageFileFor("dist", "https://knackdesk.com/about/")).toBe("dist/about/index.html");
    expect(pageFileFor("dist", "https://knackdesk.com/guides/x/")).toBe("dist/guides/x/index.html");
  });
});

describe("hashPages", () => {
  it("hashes each URL's HTML and skips URLs with no file", () => {
    const files = { "d/index.html": "home", "d/a/index.html": "page a" };
    const readFile = (p) => {
      if (!(p in files)) throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      return files[p];
    };
    const h = hashPages("d", ["https://s.com/", "https://s.com/a/", "https://s.com/missing/"], readFile);
    expect(Object.keys(h)).toEqual(["https://s.com/", "https://s.com/a/"]);
    expect(h["https://s.com/"]).toMatch(/^[0-9a-f]{64}$/);
    expect(h["https://s.com/"]).not.toBe(h["https://s.com/a/"]);
  });
});

describe("changedUrls", () => {
  it("returns new, changed and removed URLs, not unchanged ones", () => {
    const prev = { "https://s.com/": "1", "https://s.com/a/": "2", "https://s.com/gone/": "3" };
    const next = { "https://s.com/": "1", "https://s.com/a/": "9", "https://s.com/new/": "4" };
    expect(changedUrls(prev, next)).toEqual(["https://s.com/a/", "https://s.com/new/", "https://s.com/gone/"]);
  });
  it("returns every URL when there is no previous manifest", () => {
    expect(changedUrls(null, { "https://s.com/": "1", "https://s.com/a/": "2" })).toEqual(["https://s.com/", "https://s.com/a/"]);
  });
  it("returns nothing when nothing changed", () => {
    expect(changedUrls({ "https://s.com/": "1" }, { "https://s.com/": "1" })).toEqual([]);
  });
});
