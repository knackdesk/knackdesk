---
polar_url: https://buy.polar.sh/polar_cl_KxX8Vt9WRK0bnQjFZBz17Q1xyIPhAZMYKKDSI0oneuN
slug: loan-lease-comparison-workbook
name: Loan & Lease Comparison Workbook
lane: digital
category: planning
price_cents: 1200
status: live
tagline: Compare up to four loan offers by APR and total cost, run a full payoff schedule with extra payments, and check lease vs buy and DSCR
description: An Excel and Google Sheets workbook for small businesses weighing finance. Line up four loan offers with their rates, terms and fees to see payment, total cost and true APR side by side; generate a month-by-month amortisation schedule with optional extra payments and the interest saved; compare leasing with buying over the same period; and check your debt service coverage ratio before and after a new loan. Formulas only, no macros.
---
# Loan & Lease Comparison Workbook

**Audience:** owners and finance leads comparing loan or lease offers for equipment, vehicles or working capital.
**Problem:** the loan calculators answer one question each; the workbook keeps several offers, the schedule and the coverage check together so the decision is made on one page.
**Monetization:** one-time purchase on Polar at 12 USD; cross-sold from the planning pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Loan Compare, Schedule, Lease vs Buy, DSCR; zipped with a README into `assets/loan-lease-comparison-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** variable rates, balloon payments, tax treatment, lender-specific APR disclosure rules, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Decide on finance with every offer on one page. The Loan & Lease Comparison Workbook is a single workbook:
- **Loan compare:** up to four offers with amount, rate, term and fees; monthly payment, total interest, total cost and true APR are calculated and the cheapest offer is ranked.
- **Schedule:** a month-by-month amortisation table for up to 30 years with an optional extra payment, showing interest, principal and balance each month, the payoff date and the interest saved.
- **Lease vs buy:** total cost of leasing against buying on finance over the same period, with resale value and buyout handled correctly.
- **DSCR:** debt service coverage ratio today and after a proposed loan, with the largest payment a lender's target allows.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
