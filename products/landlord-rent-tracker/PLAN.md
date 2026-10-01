---
polar_url: https://buy.polar.sh/polar_cl_Qw4fGfBbhsVtV6plMwQVe5kGdsnm346HD3BU53Pmv8l
slug: landlord-rent-tracker
name: Landlord Rent & Expense Tracker
lane: digital
category: property
price_cents: 1200
status: live
tagline: Rent log, late payments, expenses and yield for every property in one workbook
description: An Excel and Google Sheets workbook for small landlords. Keep a rent log per property with due dates, days late and outstanding balances, record expenses by category, and see rent collected, costs, net income and gross and net yield for each property and for the whole portfolio. Formulas only, no macros.
---
# Landlord Rent & Expense Tracker

**Audience:** landlords with one to ten rental units who track rent in a spreadsheet.
**Problem:** the rent and property tools answer one question at a time; the tracker keeps the rent roll, late payments, expenses and yields together and updates them automatically.
**Monetization:** one-time purchase on Polar at 12 USD; cross-sold from the property tool pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Properties, Rent Log, Expenses, Summary; zipped with a README into `assets/landlord-rent-tracker.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** macros, tax calculations, deposit-protection or notice rules (vary by jurisdiction), bank imports.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know exactly who has paid, who is late and what each property really earns. The Landlord Rent & Expense Tracker is a single workbook:
- **Properties:** address, tenant, rent, lease dates, deposit held and purchase price, up to 10 units.
- **Rent log:** one row per month per property; days late and outstanding balance calculated automatically.
- **Expenses:** log repairs, insurance, fees and more by property and category.
- **Summary:** rent collected, expenses, net income and gross and net yield per property and for the portfolio.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
