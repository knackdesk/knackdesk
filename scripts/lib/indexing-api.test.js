import { describe, it, expect } from "vitest";
import { parseSitemapUrls, publishUrl, INDEXING_SCOPE } from "./indexing-api.js";

describe("parseSitemapUrls", () => {
  it("extracts every loc from a sitemap", () => {
    const xml = `<?xml version="1.0"?><urlset><url><loc>https://knackdesk.com/</loc></url><url><loc>https://knackdesk.com/kits/</loc><lastmod>2026-10-02</lastmod></url></urlset>`;
    expect(parseSitemapUrls(xml)).toEqual(["https://knackdesk.com/", "https://knackdesk.com/kits/"]);
  });
});

describe("publishUrl", () => {
  it("posts URL_UPDATED for the url with the bearer token and returns the notification metadata", async () => {
    const calls = [];
    const fetchImpl = async (url, init) => { calls.push({ url, init }); return { status: 200, text: async () => JSON.stringify({ urlNotificationMetadata: { url: "https://knackdesk.com/kits/", latestUpdate: { type: "URL_UPDATED", notifyTime: "2026-10-05T10:00:00Z" } } }) }; };
    const r = await publishUrl({ accessToken: "t", url: "https://knackdesk.com/kits/", fetchImpl });
    expect(calls[0].url).toBe("https://indexing.googleapis.com/v3/urlNotifications:publish");
    expect(calls[0].init.method).toBe("POST");
    expect(calls[0].init.headers.Authorization).toBe("Bearer t");
    expect(JSON.parse(calls[0].init.body)).toEqual({ url: "https://knackdesk.com/kits/", type: "URL_UPDATED" });
    expect(r.urlNotificationMetadata.latestUpdate.type).toBe("URL_UPDATED");
  });
  it("surfaces API errors with status and body", async () => {
    const fetchImpl = async () => ({ status: 403, text: async () => '{"error":{"message":"Indexing API has not been used in project"}}' });
    await expect(publishUrl({ accessToken: "t", url: "https://knackdesk.com/", fetchImpl })).rejects.toThrow(/403/);
  });
  it("uses the indexing scope", () => {
    expect(INDEXING_SCOPE).toBe("https://www.googleapis.com/auth/indexing");
  });
});
