# Launch Checklist (copy into products/<slug>/LAUNCH.md)

- [x] PLAN.md front-matter complete (slug, name, lane, price_cents, status, tagline, description)
- [x] Tests written first and passing (`npm test`)
- [ ] code-reviewer agent: no CRITICAL/HIGH open
- [ ] security-reviewer agent: no CRITICAL/HIGH open
- [x] LICENSES.md lists every third-party asset/library (MIT/CC0 only)
- [x] Deliverable built (`assets/*.zip` for kits, `public/` for tools, `dist.zip` for extensions)
- [x] Cover image: cover.png + 3 sheet shots in assets/images, on Polar and /kits/
- [x] Pushed to main (product is draft; not on the site until listed)
- [ ] Polar listing created (`npm run polar:create -- <slug>`), URL recorded below
- [ ] Row added to pipeline/LEDGER.md
- [ ] Status message sent to owner

Live URL:
Polar URL:

Build steps: `.venv/bin/python products/freelancer-finance-kit/src/build_kit.py --out products/freelancer-finance-kit/assets`, then recalc with the xlsx skill's recalc.py (LibreOffice), then re-zip xlsx + README.
