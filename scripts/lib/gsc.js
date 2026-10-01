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
