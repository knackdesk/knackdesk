import { loadDotEnv, requireEnv } from "./lib/env.js";
import { request } from "./lib/http.js";

await loadDotEnv();
const { INDEXNOW_KEY } = requireEnv(["INDEXNOW_KEY"]);
const host = "knackdesk.com";
const { json: _ignored, ...sitemap } = await request(`https://${host}/sitemap.xml`);
const xml = await (await fetch(`https://${host}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("sitemap has no URLs");
const res = await request("https://api.indexnow.org/indexnow", {
  method: "POST",
  body: { host, key: INDEXNOW_KEY, keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`, urlList },
});
console.log(`indexnow: submitted ${urlList.length} urls, status ${res.status}`);
