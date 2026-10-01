---
polar_url: https://buy.polar.sh/polar_cl_2yBraDoA9wMFyUyrHbAfdQ9wVU3aIJ2hVS0C71SfxI1
slug: agency-quote-profit-tracker
name: Agency Quote & Project Profit Tracker
lane: digital
category: pricing, planning
price_cents: 1400
status: live
tagline: Rate card, quote builder with blended rate and margin, and a project tracker that shows what each job really earned
description: An Excel and Google Sheets workbook for agencies, studios and consultants. Keep a rate card with bill rates and internal cost per role; build a quote by listing tasks with roles and hours to get the price, blended rate, contingency, discount and expected margin; and track every project's actual hours, cost, profit, margin, effective rate, overrun and outstanding invoices with a summary across the year. Formulas only, no macros.
---
# Agency Quote & Project Profit Tracker

**Audience:** agencies, studios and freelancers who quote fixed prices and want to know which projects pay.
**Problem:** the agency calculators answer one question per project; the tracker keeps the rate card, every quote and every project's real margin consistent in one file.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the pricing and planning pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Rate Card, Quote, Projects, Summary; zipped with a README into `assets/agency-quote-profit-tracker.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** time tracking, invoicing, multi-currency, macros, tax.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Quote with confidence and find out which projects actually made money. The Agency Quote & Project Profit Tracker is a single workbook:
- **Rate card:** bill rate and internal cost per role, with the margin and markup each role earns.
- **Quote builder:** list tasks with a role and hours; bill amounts, internal cost, expenses, contingency and discount roll up into the quote total, blended rate, expected profit, margin and working days.
- **Project tracker:** one row per project with price, estimated and actual hours, cost, expenses, invoiced and paid; profit, margin, effective hourly rate, hours overrun and outstanding balance are calculated.
- **Summary:** revenue, cost, profit, average margin, hours billed, average effective rate, outstanding invoices and how many projects overran.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
