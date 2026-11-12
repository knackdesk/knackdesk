# Knackdesk

Small, useful tools and kits. This monorepo holds the brand site, every product, and the scripts that ship them.

- `site/` brand site pages
- `products/<slug>/` one folder per product (see `pipeline/LAUNCH-CHECKLIST.md`)
- `pipeline/` backlog, scoring rubric, ledger
- `scripts/` build, deploy, Polar and Cloudflare automation

Setup: copy `.env.example` to `.env`, fill tokens, run `npm run check-env`.
Design spec: `docs/superpowers/specs/2026-09-30-knackdesk-passive-income-factory-design.md`

After every deploy, the sitemap is resubmitted to Google Search Console and only the new, changed or removed pages are pushed to IndexNow (see `.github/workflows/deploy.yml`, job `notify`). `scripts/indexnow-diff.js` hashes each built page into `dist/indexnow-hashes.json`, compares it with the live copy on knackdesk.com, and writes the differences to `indexnow-urls.txt`. To push every sitemap URL by hand after a site-wide change, run `npm run submit:indexnow`.
