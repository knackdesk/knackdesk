---
polar_url: https://buy.polar.sh/polar_cl_1kxM2saIYYrH9BHa9p1Yp1V7mSAUgu68kmN170pYLqo
slug: freelancer-finance-kit
name: Freelancer Finance Kit
lane: digital
price_cents: 1200
status: live
tagline: One spreadsheet for invoices, due dates, late fees, rates and cash flow
description: An Excel and Google Sheets workbook for freelancers and small studios. Track every invoice with automatic due dates, days overdue and late fees, set your hourly and day rate from your income goal, plan deposit and milestone payments, log expenses, and see a monthly and quarterly summary. Formulas only, no macros, works in Excel, Google Sheets and Numbers.
---
# Freelancer Finance Kit

**Audience:** freelancers, contractors and small studios who invoice a handful of clients a month and run their money in a spreadsheet.
**Problem:** the ten free Knackdesk tools answer one question at a time; the kit keeps the answers in one place and updates them automatically as invoices are added.
**Monetization:** one-time purchase on Polar at 12 USD; cross-sold from every tool page once listed.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Invoices, Rate Calculator, Payment Schedule, Expenses, Summary; zipped with a README into `assets/freelancer-finance-kit.zip`. Blue inputs, black formulas, one example row per table, legend on Start Here.
**Out of scope:** macros, currency conversion, tax filing, bank imports.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip. Last verified 2026-09-30: 813 formulas, 0 errors.
**Done when:** `npm test` passes (structure and formula checks), recalc reports zero formula errors, zip built, listing copy in this file, LAUNCH.md ticked except the Polar steps.

## Listing copy (Polar)
Stop guessing when invoices are due or what a late payment costs you. The Freelancer Finance Kit is a single workbook that does the arithmetic for you:
- **Invoices:** enter the date and terms, get the due date, days overdue and late fee automatically, with totals for outstanding and overdue.
- **Rate calculator:** turn a target income, expenses and time off into the hourly and day rate you need.
- **Payment schedule:** split any project into a deposit and milestones with dates.
- **Expenses:** log costs by category and see monthly totals.
- **Summary:** invoiced, paid, outstanding and expenses by month and quarter.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
