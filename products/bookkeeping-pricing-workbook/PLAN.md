---
polar_url: https://buy.polar.sh/polar_cl_wPU7SsB5KkCYcyvsbQ53U1oKulPr8GHxrGPYI0otoxe
slug: bookkeeping-pricing-workbook
name: Bookkeeping Practice Pricing Workbook
lane: digital
category: pricing
price_cents: 1400
status: live
tagline: Turn transactions, accounts and hours into monthly package fees you can defend, quote catch-up work and see how much of your time actually gets paid
description: An Excel and Google Sheets workbook for bookkeepers, accountants and tax preparers who price ongoing client work. Turn your overhead and income goal into a cost-recovery hourly rate, build each client's monthly package from transactions, accounts and add-ons, check it against an hourly-equivalent fee with a scope buffer, and see the gap to what you charge today. Quote catch-up jobs, see how many more clients your hours can hold, and log billing, collection and overall realization month by month. Formulas only, no macros.
---
# Bookkeeping Practice Pricing Workbook

**Audience:** bookkeepers, accountants, tax preparers and small professional practices that price ongoing client work.
**Problem:** monthly fees get set once at onboarding and never revisited while transaction volumes, accounts and hours creep up; catch-up work is quoted on gut feel; nobody knows how many more clients the week can hold; and the gap between hours worked, hours billed and cash collected goes unmeasured.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the bookkeeping package price, catch-up fee, hourly to fixed fee, client capacity and realization rate pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Package Builder, Catch-Up Quotes, Capacity, Realization Log, Summary; zipped with a README into `assets/bookkeeping-pricing-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** time tracking, invoicing, payroll, tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what every client file has to earn. The Bookkeeping Practice Pricing Workbook turns your overhead, income goal and hours into monthly fees you can defend:
- **Package builder:** a cost-recovery hourly rate from your own overhead and income goal, then each client's package fee from transactions, accounts and add-ons, an hourly-equivalent fee with a scope buffer, the recommended fee and the gap to what you charge today.
- **Catch-up quotes:** months behind × hours per month at your rate or your own, plus setup fee and discount, with the quote total and the per-month figure.
- **Capacity:** usable hours after admin time, how many clients they hold, spare hours, open client slots and revenue at capacity.
- **Realization log and summary:** billing, collection and overall realization each month with write-offs and uncollected, plus clients below recommended, the revenue uplift and your highest and lowest effective rate clients.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
