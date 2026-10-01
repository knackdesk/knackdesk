import { request } from "./http.js";

export const DEFAULT_SITE_URL = "sc-domain:knackdesk.com";
export const DEFAULT_SITEMAP_URL = "https://knackdesk.com/sitemap.xml";
const API = "https://www.googleapis.com/webmasters/v3/sites";

const collectionUrl = (siteUrl) => `${API}/${encodeURIComponent(siteUrl)}/sitemaps`;
const auth = (accessToken) => ({ Authorization: `Bearer ${accessToken}` });

export async function submitSitemap({ accessToken, siteUrl = DEFAULT_SITE_URL, sitemapUrl = DEFAULT_SITEMAP_URL, fetchImpl = fetch }) {
  const url = `${collectionUrl(siteUrl)}/${encodeURIComponent(sitemapUrl)}`;
  const { status } = await request(url, { method: "PUT", headers: auth(accessToken), fetchImpl });
  return { status };
}

export async function listSitemaps({ accessToken, siteUrl = DEFAULT_SITE_URL, fetchImpl = fetch }) {
  const { json } = await request(collectionUrl(siteUrl), { method: "GET", headers: auth(accessToken), fetchImpl });
  return json;
}

const isoDate = (d) => d.toISOString().slice(0, 10);

/** Search Console data lags about three days; the window ends then and spans `days`. */
export function analyticsWindow(now = new Date(), days = 28) {
  const end = new Date(now.getTime() - 3 * 86400000);
  const start = new Date(end.getTime() - (days - 1) * 86400000);
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

export async function searchAnalytics({ accessToken, siteUrl = DEFAULT_SITE_URL, dimension = "query", startDate, endDate, rowLimit = 25, fetchImpl = fetch }) {
  const url = `${API}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const body = { startDate, endDate, dimensions: [dimension], rowLimit };
  const { json } = await request(url, { method: "POST", headers: auth(accessToken), body, fetchImpl });
  return (json?.rows ?? []).map((r) => ({ key: r.keys?.[0] ?? "", clicks: r.clicks ?? 0, impressions: r.impressions ?? 0, ctr: r.ctr ?? 0, position: r.position ?? 0 }));
}
