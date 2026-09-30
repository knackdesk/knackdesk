import { loadDotEnv, requireEnv } from "./lib/env.js";
import { ensureRecords } from "./lib/cloudflare.js";

await loadDotEnv();
const env = requireEnv(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID"]);
const out = await ensureRecords({ token: env.CLOUDFLARE_API_TOKEN, zoneId: env.CLOUDFLARE_ZONE_ID, domain: "knackdesk.com", ghOrg: "knackdesk" });
console.log(`dns: created ${out.created}, kept ${out.kept}`);
for (const r of out.stale) console.warn(`stale record, remove by hand in Cloudflare: ${r.type} ${r.name} -> ${r.content}`);
console.log("next: in GitHub repo settings > Pages, set custom domain knackdesk.com and enforce HTTPS");
