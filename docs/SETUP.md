# Owner Setup (one time, about 30 minutes)

Paste each value into `.env` (copy `.env.example` first). Run `npm run check-env` to confirm.

## 1. GitHub (needed to publish anything)
1. github.com > your avatar > Your organizations > New organization > Free > name `knackdesk`. Use your existing GitHub login; no new account needed.
2. Settings > Developer settings > Personal access tokens > Fine-grained > Generate.
   Resource owner: knackdesk. Repository access: All repositories.
   Permissions: Administration (read/write), Contents (read/write), Pages (read/write), Workflows (read/write), Variables (read/write).
3. Paste as `GITHUB_TOKEN`.

## 2. Polar (needed to sell)
1. polar.sh > Sign up with the same GitHub login > Create organization `knackdesk`.
2. Finance > Payout account > connect Stripe (identity + bank).
3. Settings > Developers > New token. Scopes: products:read, products:write, files:read, files:write, benefits:read, benefits:write, orders:read.
4. Paste as `POLAR_ACCESS_TOKEN`. Organization id is in Settings > General; paste as `POLAR_ORG_ID`.

## 3. Cloudflare (needed for knackdesk.com) — DONE 2026-09-30
1. cloudflare.com > Domain Registration > Register > knackdesk.com (about 10 USD/yr).
2. Overview page of the zone: copy Zone ID > `CLOUDFLARE_ZONE_ID`.
3. My Profile > API Tokens > Create Token > Edit zone DNS template > Zone: knackdesk.com > paste as `CLOUDFLARE_API_TOKEN`.

## 4. AdSense (later, when told the site is ready)
Sign up at adsense.google.com with knackdesk.com, paste the `ca-pub-...` id into the GitHub repo variable `ADSENSE_CLIENT_ID` (Settings > Secrets and variables > Actions > Variables).

## 5. Chrome Web Store (later, when the first extension is ready)
Pay the 5 USD registration at chrome.google.com/webstore/devconsole.

## 6. Search Console API (automatic sitemap submission)
After every deploy the `notify` job submits the sitemap to Google Search Console and IndexNow. Each step prints "skipped" until its secret exists.
1. console.cloud.google.com > New project "knackdesk".
2. APIs & Services > Library > enable "Google Search Console API".
3. APIs & Services > Credentials > Create credentials > Service account "knackdesk-ci".
4. Open the service account > Keys > Add key > Create new key > JSON (downloads a file).
5. search.google.com/search-console > property `sc-domain:knackdesk.com` > Settings > Users and permissions > Add user > paste the service account's email (`client_email` in the JSON) > permission Owner.
6. GitHub repo > Settings > Secrets and variables > Actions > New repository secret:
   - `GSC_SERVICE_ACCOUNT_JSON` = the JSON file contents on one line (or base64 of the file: `base64 -i key.json | tr -d '\n'`).
   - `INDEXNOW_KEY` = the `INDEXNOW_KEY` value from `.env`.
Local run: `npm run submit:gsc` / `npm run submit:indexnow`.
