# Knackdesk Passive-Income Factory — Design Spec

Date: 2026-09-30
Status: approved in conversation, pending written review
Owner: Matija Kovacek (company); built and operated by Claude Code

## 1. Purpose

Build a repeatable system that researches, plans, implements, tests and ships small passive-income products under a neutral brand (**Knackdesk**), with zero infrastructure cost and near-zero maintenance. The loop runs product after product until the owner says stop.

Success means: products are live and purchasable or ad-monetized, each launch costs nothing beyond Claude usage and one domain, and revenue is visible in a ledger without manual bookkeeping.

## 2. Constraints (from the owner)

- **Zero infra cost.** Free tiers only: GitHub (repo, Actions, Pages), Polar.sh Starter plan, Cloudflare free DNS. Accepted one-off costs: domain (~10 USD/yr), Chrome Web Store registration (5 USD once).
- **Low maintenance.** No servers, no databases, no cron jobs outside GitHub Actions, no products that need moderation or support rotas.
- **Brand.** Everything is published as Knackdesk, never under the company name.
- **Execution model.** The owner creates accounts and pastes API tokens into `.env`. Claude does everything else through APIs and git.
- **Allowed product lanes.** Paid digital products; free client-side web tools monetized by ads and affiliate links; browser extensions. Not allowed: content sites, newsletters, anything with a monthly platform fee.

## 3. Brand and accounts

Brand: **Knackdesk** — "knack" (a useful skill or trick) + "desk" (a workbench of tools). Verified 2026-09-30: knackdesk.com unregistered, github.com/knackdesk free.

| Service | Purpose | Owner action | Token handed to Claude |
|---|---|---|---|
| GitHub org `knackdesk` | Code, CI, free hosting via Pages | Create org, create fine-grained PAT | `GITHUB_TOKEN` (contents, pages, workflows, admin on org repos) |
| Cloudflare | Registrar + free DNS for knackdesk.com | Buy domain, create API token scoped to DNS edit on that zone | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID` |
| Polar.sh | Merchant of record for paid products and license keys (5% + 0.50 USD per sale) | Create org `knackdesk`, connect payout, create org access token | `POLAR_ACCESS_TOKEN`, `POLAR_ORG_ID` |
| Gumroad (fallback only) | Used only if Polar rejects the account | Create account, create API token | `GUMROAD_ACCESS_TOKEN` |
| Google AdSense | Ads on free tools | Apply once the site has 15+ original pages; paste the publisher ID | `ADSENSE_CLIENT_ID` (public value) |
| Chrome Web Store | Extension distribution | Register developer account when first extension is ready | Publisher OAuth credentials |

Tokens live only in `.env` at the repo root, which is git-ignored. `scripts/check-env.js` fails fast if a required token is missing.

## 4. Repository architecture

Single monorepo `knackdesk/knackdesk`, static-first, Node 20 tooling.

```
knackdesk/
  .github/workflows/deploy.yml   # build + deploy to GitHub Pages on push to main
  .env.example                   # every token name, no values
  package.json                   # workspaces: site, products/*
  site/                          # brand site: index (tool directory), about, privacy, terms, contact
  products/<slug>/               # one product per folder
    PLAN.md                      # idea, audience, monetization, scope, done-criteria
    LAUNCH.md                    # launch checklist with ticks and URLs
    src/  test/                  # product code and tests (for tools/extensions)
    assets/                      # deliverable files (for digital products)
  pipeline/
    BACKLOG.md                   # scored idea backlog
    LEDGER.md                    # every shipped product, date, URL, revenue
    SCORING.md                   # the rubric (section 6)
    LAUNCH-CHECKLIST.md          # canonical checklist copied into each LAUNCH.md
  scripts/
    check-env.js                 # validate tokens present
    build-site.js                # generate site index from products/*/PLAN.md front-matter
    polar-create-product.js      # create/update a Polar product from PLAN.md metadata + assets
    polar-sales.js               # pull orders, update LEDGER.md
    cloudflare-dns.js            # point knackdesk.com at GitHub Pages
  docs/superpowers/specs/        # this spec and future ones
  docs/superpowers/plans/        # implementation plans
```

Design rules:
- Every product is self-contained: no cross-product imports except a tiny `shared/` for site layout and analytics snippet.
- Products are plain HTML/CSS/JS or built with Vite when a framework is genuinely needed. Output is static.
- Files stay under 400 lines; product logic is unit-tested with Vitest.

## 5. The loop

One loop turn:

1. **Research.** Gather at least five candidate ideas from real demand signals: marketplace bestsellers (Polar, Gumroad discover, Chrome Web Store), keyword tools and autocomplete, forum pain points, competitor gaps. Record each in `BACKLOG.md` with sources.
2. **Score.** Apply the rubric in section 6. Pick the highest score that is not blocked by a missing account.
3. **Plan.** Write `products/<slug>/PLAN.md`: audience, problem, monetization, exact scope, out-of-scope, done-criteria, test plan. Keep it under one page.
4. **Build.** Tests first for any logic. Implement. Files small. No secrets in code.
5. **Review.** Run code-reviewer and security-reviewer agents. Fix CRITICAL and HIGH.
6. **Ship.** Push to main (deploys site), create the Polar listing or publish the extension, tick `LAUNCH.md`, add a row to `LEDGER.md`.
7. **Report.** Post a short status to the owner: what shipped, URL, what account action (if any) is pending.
8. **Next.** Schedule the next turn via the loop scheduler.

Stop conditions: the owner says stop; or a turn is blocked on an owner action (token, domain, AdSense) — then Claude continues with any product that does not need that action and reports the blocker once.

Review turn: after every six shipped products, one turn is spent pulling sales, ranking products, and updating the backlog weights toward what earns.

## 6. Scoring rubric

Each idea scores 1–5 on five axes; total out of 25. Ship threshold: 16+.

| Axis | 5 means | 1 means |
|---|---|---|
| Demand evidence | Multiple independent signals of people paying or searching now | A hunch |
| Competition gap | Few or poor incumbents, clear angle | Saturated with strong free options |
| Build effort | Under one loop turn | Multiple turns |
| Maintenance | None after launch | Needs updates, data feeds or support |
| Monetization fit | Clear price point or proven ad/affiliate category | Unclear how it earns |

Hard filters before scoring: no server or database; no user accounts; no scraping of third-party data at runtime; no medical, legal or financial advice products; nothing that violates the platform's policies.

## 7. Product lanes and monetization

**Paid digital products (first lane, ships before the domain is live).** Templates, spreadsheet kits, checklists, prompt and skill packs, icon sets. Sold on Polar at 5–29 USD one-time. Deliverable is a zip; Polar handles VAT, delivery and refunds. Listing copy and cover image are generated per product; cover images via Canva connector.

**Free web tools (second lane, needs domain).** Single-purpose client-side tools (calculators, converters, generators, formatters). Each ships with an original 600+ word explainer page written for humans, an FAQ, and a related-tools block, which is what AdSense approval needs. Affiliate links only where a product recommendation is genuinely useful. Until AdSense is approved, tools carry a "buy the pro kit" cross-sell to a paid product.

**Browser extensions (third lane, after two products in each other lane).** Chrome extensions with freemium pricing; pro features unlocked with a Polar license key validated client-side against the Polar license API. Manifest V3 only.

## 8. Shipping pipeline

- `git push` to main triggers `deploy.yml`: install, test, build site, deploy `dist/` to GitHub Pages.
- Custom domain: `CNAME` file in `site/`, DNS set once by `cloudflare-dns.js`. Before the domain exists, products are reachable at `knackdesk.github.io`.
- Polar listing: `polar-create-product.js <slug>` reads `PLAN.md` front-matter (name, price, description, benefits) and uploads `assets/*.zip` as a downloadable benefit. Idempotent: reruns update, never duplicate.
- Extensions: built to `products/<slug>/dist.zip`; upload via the Chrome Web Store API once credentials exist, otherwise the zip is left for the owner with one-line instructions.

## 9. Quality and security

- Unit tests with Vitest for all product logic; e2e smoke for each tool with Playwright in CI (free on GitHub Actions).
- Reviews: code-reviewer and security-reviewer agents before every ship.
- No secrets in the repo; `.env` git-ignored; `check-env.js` validates at script start.
- Privacy: no cookies or tracking beyond AdSense and a cookie-less counter (Cloudflare Web Analytics, free). Privacy and terms pages generated from a template.
- Licensing: only MIT/CC0 assets and libraries; a `LICENSES.md` per product lists them.

## 10. Tracking and reporting

- `pipeline/LEDGER.md`: slug, lane, launch date, URL, price, units, gross, net. `polar-sales.js` refreshes units and revenue.
- End-of-turn status message: shipped item, URL, blockers, next idea.
- Memory: brand, decisions and blockers are kept in Claude's project memory so new sessions resume without re-asking.

## 11. Human touchpoints (complete list)

1. Create GitHub org and token.
2. Buy knackdesk.com on Cloudflare and create the DNS token.
3. Create Polar org, connect payouts, create token.
4. Apply for AdSense when told the site is ready, paste the publisher ID.
5. Register Chrome Web Store account when told the first extension is ready.
6. Say "stop" to end the loop.

Everything else is automated.

## 12. Out of scope

Servers, databases, user accounts, paid ads, social media posting, newsletters, content farms, anything requiring ongoing human moderation or support.
