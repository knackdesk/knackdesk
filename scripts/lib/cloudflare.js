import { request } from "./http.js";

const API = "https://api.cloudflare.com/client/v4";
const GH_A = ["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"];
const GH_AAAA = ["2606:50c0:8000::153", "2606:50c0:8001::153", "2606:50c0:8002::153", "2606:50c0:8003::153"];

export function desiredRecords(domain, ghOrg) {
  const base = { proxied: false, ttl: 1 };
  return [
    ...GH_A.map((content) => ({ type: "A", name: domain, content, ...base })),
    ...GH_AAAA.map((content) => ({ type: "AAAA", name: domain, content, ...base })),
    { type: "CNAME", name: "www", content: `${ghOrg}.github.io`, ...base },
  ];
}

const fqdn = (name, domain) => (name === "www" ? `www.${domain}` : name);
const key = (r, domain) => `${r.type}|${fqdn(r.name, domain)}|${r.content}`;

export function planChanges(existing, desired, domain) {
  const have = new Set(existing.map((r) => key(r, domain)));
  const keep = desired.filter((r) => have.has(key(r, domain)));
  const create = desired.filter((r) => !have.has(key(r, domain)));
  return { create, keep };
}

export async function ensureRecords({ token, zoneId, domain, ghOrg, fetchImpl = fetch }) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = `${API}/zones/${zoneId}/dns_records`;
  const { json } = await request(`${url}?per_page=100`, { headers, fetchImpl });
  const { create, keep } = planChanges(json.result ?? [], desiredRecords(domain, ghOrg), domain);
  for (const rec of create) await request(url, { method: "POST", headers, body: rec, fetchImpl });
  return { created: create.length, kept: keep.length };
}
