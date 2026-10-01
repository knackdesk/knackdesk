# Research step (runs at the start of every build turn)

Decide what to build from evidence, then score it with SCORING.md. Record the outcome as a BACKLOG.md row with the sources column filled in before any code is written.

## 1. Our own signals (`npm run research`)
- **Search Console** (28-day window, 3-day lag): top queries and pages by impressions and clicks. Queries with impressions but position worse than 10 are "near misses": build or strengthen a page for them. Pages with impressions and low CTR need a better headline. Empty until Google serves the pages; expect data from mid-October 2026.
- **Cloudflare Web Analytics**: page views per path. Which categories draw visitors decides where the next kit goes. Needs `CLOUDFLARE_WEB_ANALYTICS_SITE_TAG` in .env (Analytics & Logs > Web Analytics > site > Manage site).
- **Polar ledger**: units and gross per kit. A kit that sells justifies more tools in its category; a category with traffic and no sales needs a different kit or price.

## 2. Outside signals (web search, 3 to 5 queries per candidate)
- "<tool name> calculator": who ranks, whether the top results are thin pages, bank or SaaS pages, or strong dedicated tools. A gap is when the first page is generic, outdated or hidden behind sign-ups.
- "<audience> spreadsheet template" and "<audience> calculator": what people already buy or use, and the price points on marketplaces.
- Related queries and forum threads: the exact wording people use; use it in headlines.
- Note the date of any fee, rate or rule a tool depends on; those become editable defaults with a reviewed date.

## 3. Pick and score
- A cluster is five tools for one audience with one shared vocabulary, in an existing category, each with a kit to cross-sell.
- Score demand, gap, effort, maintenance and money 1 to 5 per SCORING.md. Ship threshold 16. Write the sources into the backlog row (query seen, competitor seen, our own metric if any).
- Prefer, in order: queries we already get impressions for; audiences adjacent to a selling kit; high-value categories (finance, lending, B2B) where the first page is weak.

## 4. Then build
Tests first, pages with the exact wording found in research, kit paired or planned, ship, record metrics expectations in the backlog row for the next review.
