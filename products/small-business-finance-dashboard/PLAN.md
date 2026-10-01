---
polar_url: https://buy.polar.sh/polar_cl_Yc1VqxdIwOr95PcNp1C6kKhjNozUrUEDrh1d03NUg8d
slug: small-business-finance-dashboard
name: Small Business Finance Dashboard
lane: digital
category: planning
price_cents: 1400
status: live
tagline: Monthly profit and loss with margins, expense breakdown, tax set-aside, owner draws and what the business keeps
description: An Excel and Google Sheets workbook for owners of small businesses and sole traders. Log revenue, cost of sales and operating expenses by category each month to get gross, operating and pre-tax profit with margins, a tax set-aside at the percentage you choose, owner draws and the amount retained, plus a year-to-date summary with best and worst months and the largest expense category. Formulas only, no macros.
---
# Small Business Finance Dashboard

**Audience:** owners of small businesses and sole traders who do not have monthly management accounts.
**Problem:** the finance calculators answer one question for one period; the dashboard keeps twelve months of margins, expenses, tax set-aside and draws in one file that updates as each month is entered.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the planning pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Expenses, Monthly P&L, Summary; zipped with a README into `assets/small-business-finance-dashboard.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** bookkeeping, bank imports, tax rates by country, macros, balance sheet.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
See where every month's revenue went and what the business actually kept. The Small Business Finance Dashboard is a single workbook:
- **Expenses:** operating expenses by category and month, with yearly totals and each category's share.
- **Monthly P&L:** revenue and cost of sales per month; gross profit, operating profit and pre-tax profit with margins, the tax set-aside at your percentage, owner draws, retained profit and the running total.
- **Summary:** year-to-date totals and margins, average monthly revenue, best and worst months, total set aside for tax, draws taken and the largest expense category.
- **Settings:** the tax set-aside percentage and year in one place.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
