---
polar_url: https://buy.polar.sh/polar_cl_OBBsiKSM4hFSr1kEAo4BmryGy2P76krpK5WPl4UeeFA
slug: freelance-pricing-kit
name: Freelance Pricing Kit
lane: digital
price_cents: 900
status: live
tagline: Rate card, quote builder, retainer pricer and revenue plan in one workbook
description: An Excel and Google Sheets workbook for pricing freelance work. Set your rates once and get a rate card with rush and day rates, build itemised quotes with discount, VAT, deposit and milestones, price monthly retainers with the effective rate shown, and turn a revenue goal into the proposals you need to send. Formulas only, no macros.
---
# Freelance Pricing Kit

**Audience:** freelancers and small studios who quote work and want consistent pricing.
**Problem:** the pricing tools on knackdesk.com answer one question each; the kit keeps rates, quotes and targets together and consistent.
**Monetization:** one-time purchase on Polar at 9 USD; cross-sold from every tool page with the Finance Kit.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Rates, Rate Card, Quote Builder, Retainer, Revenue Plan; zipped with a README into `assets/freelance-pricing-kit.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** macros, contracts, tax advice.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Price every job the same way, in seconds. The Freelance Pricing Kit is a single workbook:
- **Rates:** enter your target income, costs and billable hours once; your hourly, day and week rates follow.
- **Rate card:** standard, rush and weekend multipliers, ready to paste into a proposal.
- **Quote builder:** itemised lines, discount, VAT, deposit and milestone split with dates.
- **Retainer:** monthly fee, effective hourly rate and term total for any hour block and commitment discount.
- **Revenue plan:** annual goal to projects, clients and proposals per month.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
