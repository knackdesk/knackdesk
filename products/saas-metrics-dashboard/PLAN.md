---
polar_url: https://buy.polar.sh/polar_cl_4UIKY64EHCakdbakAWu2frzfhbDDw7KSYVQ0G09hKVW
slug: saas-metrics-dashboard
name: SaaS Metrics Dashboard
lane: digital
category: planning
price_cents: 1400
status: live
tagline: MRR, churn, NRR, LTV, CAC payback and runway in one workbook that updates as you add months
description: An Excel and Google Sheets workbook for subscription businesses. Enter your plans and customers to get MRR, ARR and ARPA; log each month's new, expansion, contraction and churned MRR to get growth, revenue churn and net revenue retention; and see lifetime value, CAC payback and cash runway from the same numbers. Formulas only, no macros.
---
# SaaS Metrics Dashboard

**Audience:** founders and operators of subscription businesses who report metrics monthly.
**Problem:** the SaaS calculators on the site answer one question each; the dashboard keeps plans, monthly movements, unit economics and runway consistent and updates them as rows are added.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the planning pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Plans, Monthly Metrics, Unit Economics, Runway; zipped with a README into `assets/saas-metrics-dashboard.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** macros, accounting, billing-system imports, forecasting beyond a constant growth rate.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Report the numbers investors ask for without rebuilding the spreadsheet every month. The SaaS Metrics Dashboard is a single workbook:
- **Plans:** price, billing period and customers per plan; MRR, ARR and ARPA follow automatically.
- **Monthly metrics:** one row per month for new, expansion, contraction and churned MRR; ending MRR, growth, gross and net revenue churn and NRR are calculated.
- **Unit economics:** lifetime value, LTV to CAC and CAC payback from ARPA, gross margin, churn and acquisition spend.
- **Runway:** months of cash left from your balance, costs and MRR, and the costs you would need to reach a target runway.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
