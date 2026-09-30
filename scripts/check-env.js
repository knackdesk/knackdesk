import { loadDotEnv, requireEnv } from "./lib/env.js";

const GROUPS = {
  github: ["GITHUB_TOKEN"],
  polar: ["POLAR_ACCESS_TOKEN", "POLAR_ORG_ID"],
  cloudflare: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID"],
};

await loadDotEnv();
let failed = false;
for (const [group, names] of Object.entries(GROUPS)) {
  try {
    requireEnv(names);
    console.log(`ok       ${group}`);
  } catch (err) {
    failed = true;
    console.log(`missing  ${group}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
