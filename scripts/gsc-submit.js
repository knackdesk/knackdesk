import { loadDotEnv } from "./lib/env.js";
import { getAccessToken } from "./lib/google-auth.js";
import { listSitemaps, submitSitemap, DEFAULT_SITE_URL, DEFAULT_SITEMAP_URL } from "./lib/gsc.js";

const SCOPE = "https://www.googleapis.com/auth/webmasters";

function formatSitemap(s) {
  return [s.path, `lastSubmitted=${s.lastSubmitted ?? "-"}`, `lastDownloaded=${s.lastDownloaded ?? "-"}`, `isPending=${s.isPending ?? "-"}`, `errors=${s.errors ?? 0}`, `warnings=${s.warnings ?? 0}`].join("  ");
}

try {
  await loadDotEnv();
  const serviceAccountJson = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (!serviceAccountJson) {
    console.log("gsc: skipped: GSC_SERVICE_ACCOUNT_JSON not set");
    process.exit(0);
  }
  const accessToken = await getAccessToken({ serviceAccountJson, scope: SCOPE });
  const { status } = await submitSitemap({ accessToken });
  console.log(`gsc: submitted ${DEFAULT_SITEMAP_URL} to ${DEFAULT_SITE_URL}, status ${status}`);
  const listed = await listSitemaps({ accessToken });
  for (const s of listed?.sitemap ?? []) console.log(`gsc: ${formatSitemap(s)}`);
} catch (err) {
  console.error(`gsc: error: ${err.message}`);
  process.exit(1);
}
