---
polar_url: https://buy.polar.sh/polar_cl_pc9Ka3XTI7s5uCW3UKMItEBHsXPHO8mtv9wJp4bwWCy
slug: team-cost-planner
name: Team Cost & Headcount Planner
lane: digital
category: time
price_cents: 1400
status: live
tagline: The true cost of every employee, raises, PTO balances and the price of turnover in one workbook
description: An Excel and Google Sheets workbook for owners and managers of small teams. List each employee with salary, employer contributions, benefits and overheads to get the full annual and monthly cost and the cost per productive hour; model raises as a percentage or amount with the real cost to the business; track paid-time-off accrual and balances per person; and plan hires and estimate what turnover costs you each year. Formulas only, no macros.
---
# Team Cost & Headcount Planner

**Audience:** owners, founders and managers of teams of 1 to 35 people who budget payroll without an HR system.
**Problem:** the pay and teams calculators answer one question for one person; the planner keeps the whole team's costs, raises, leave balances and hiring plan in one place that updates when a row changes.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the time pages (employee cost, pay raise, salary to hourly, PTO accrual, turnover cost).
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Team, Raises, PTO, Hiring & Turnover; zipped with a README into `assets/team-cost-planner.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** payroll tax tables by country, net pay, macros, HR record keeping, legal leave rules.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what your team really costs before you hire, give a raise or lose someone. The Team Cost & Headcount Planner is a single workbook:
- **Team:** one row per person with salary, employer contributions, benefits and overheads; total annual and monthly cost, cost per productive hour and the cost multiplier are calculated, with team totals.
- **Raises:** model a raise as a percentage or an amount per person and see the new salary, the monthly difference, and what it costs the business once contributions are included.
- **PTO:** paid-time-off accrual per pay period, accrued to date, balance and days still to earn for every employee.
- **Hiring and turnover:** planned hires with their cost this year, and the cost of turnover per leaver and per year from vacancy, recruiting, onboarding and ramp-up.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
