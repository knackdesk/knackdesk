# Knackdesk

Small, useful tools and kits. This monorepo holds the brand site, every product, and the scripts that ship them.

- `site/` brand site pages
- `products/<slug>/` one folder per product (see `pipeline/LAUNCH-CHECKLIST.md`)
- `pipeline/` backlog, scoring rubric, ledger
- `scripts/` build, deploy, Polar and Cloudflare automation

Setup: copy `.env.example` to `.env`, fill tokens, run `npm run check-env`.
Design spec: `docs/superpowers/specs/2026-09-30-knackdesk-passive-income-factory-design.md`

After every deploy, the sitemap is resubmitted to Google Search Console and all URLs are pushed to IndexNow (see `.github/workflows/deploy.yml`, job `notify`).
