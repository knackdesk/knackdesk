---
slug: interior-design-pricing-workbook
name: Interior Design Pricing Workbook
lane: digital
category: pricing
price_cents: 1200
status: live
polar_url: https://buy.polar.sh/polar_cl_Zp04RUJN0wpDZZKtjGOCK9GanB04KkAqvwZB71oajXo
tagline: Work out the hourly rate your studio needs, quote every project hourly or as a percentage of budget, price procurement and room fees and check each client budget adds up
description: An Excel and Google Sheets workbook for interior designers, decorators and small design studios who quote by the hour, by percentage of budget or by the room. Turn your income goal, annual overhead and billable hours into the hourly rate you need, then build each project's fee from phase hours, site visits and contingency and compare it with a percentage fee on the client's budget. Price procurement from retail, trade discount and markup with margin % and the client's saving against retail, set flat fees per room with your minimum project fee applied, and split each client budget into design fee, furniture, construction and contingency. Formulas only, no macros.
---
# Interior Design Pricing Workbook

**Audience:** interior designers, decorators and small design studios; the fee and budget sheets also serve architects and landscape designers.
**Problem:** fees are quoted from a rate copied from someone else, without counting the studio's own overhead and the hours that can actually be billed; hourly and percentage fees are chosen by habit without seeing which pays more on a given budget; procurement markups are set without knowing the margin they leave or noticing when the client would pay more than retail; small projects slip in below a sensible minimum; and client budgets are promised before the design fee, furniture, construction and contingency have been added up.
**Monetization:** one-time purchase on Polar at 12 USD; cross-sold from the design fee, hourly vs percentage fee, procurement markup, per-room flat fee and project budget allocation pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Fee Builder, Procurement, Room Fees, Budget Plan, Summary; zipped with a README into `assets/interior-design-pricing-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** invoicing, purchase orders, time tracking, tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know the rate your studio needs and what every project should cost the client. The Interior Design Pricing Workbook turns your income goal, overhead, projects, rooms and purchases into fees you can defend:
- **Hourly rate you need:** your income goal, six lines of annual overhead and the hours you can actually bill become the hourly rate you need, with room to type your own rate and price every sheet at it.
- **Fee Builder:** concept, development and documentation hours, site visits and contingency give each project's design fee, compared side by side with a percentage fee on the client's budget: which pays more, its implied hourly rate and a flag for quotes below your minimum.
- **Procurement and room fees:** retail price, trade discount, markup and freight give your cost, the client price, gross profit, margin % and the client's saving against retail; per-room hours with a complexity uplift give flat room fees, totalled per project with your minimum fee applied.
- **Budget Plan:** split each client's total budget into design fee, furniture, construction and contingency and see what is left, with over-allocated budgets flagged and counted on the Summary.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
