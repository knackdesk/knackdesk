---
polar_url: https://buy.polar.sh/polar_cl_d0doXG41OLxOByQVtjUdokqkOGhThffekrXW00xkqTg
slug: law-firm-pricing-workbook
name: Law Firm Pricing Workbook
lane: digital
category: pricing
price_cents: 1400
status: live
tagline: Work out what every timekeeper hour really costs, price flat-fee matters at your own target margin and see where budgets, write-offs and lock-up are eating your fees
description: An Excel and Google Sheets workbook for small law firms and solo practitioners who set hourly rates, quote flat fees and take contingency matters. Turn salaries or draws, benefits, billable hours and firm overhead into a cost rate per timekeeper, then price each matter type from partner, associate and paralegal hours with a scope contingency and your own target margin, and see which flat fees you charge below cost-based price. Track each matter's budget against actual hours and fees with write-offs and recovery %, measure WIP days, debtor days and lock-up days month by month, and split contingency fees into gross fee, referral fee, net fee to the firm and net to the client. Formulas only, no macros.
---
# Law Firm Pricing Workbook

**Audience:** partners, practice managers and solo practitioners of small law firms; the cost-rate, flat-fee and matter-variance sheets also serve accountants and consultants.
**Problem:** hourly rates are set against what other firms charge rather than what a timekeeper hour costs; flat fees are quoted from memory without the hours, scope creep or disbursements behind them; matters run over budget and the overrun is quietly written off; nobody tracks how many days of fees sit in unbilled WIP and unpaid bills; and contingency matters are taken without seeing what the firm nets per hour after costs and referral fees.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the timekeeper cost rate, flat fee matter price, matter budget variance, lock-up days and contingency fee split pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Timekeepers, Flat Fee Pricer, Matter Tracker, Lock-Up & Contingency, Summary; zipped with a README into `assets/law-firm-pricing-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** trust accounting, time recording, invoicing, tax, legal advice, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what every hour and every matter has to earn. The Law Firm Pricing Workbook turns your people, overhead and matters into fees you can defend:
- **Timekeeper cost rates:** salary or draw, benefits and payroll taxes, billable hours and an equal share of firm overhead become the true cost of each timekeeper's hour, with margin per hour, margin % against the bill rate and the break-even hours a year.
- **Flat fee pricer:** partner, associate and paralegal hours at the average cost rate per role, a scope contingency and disbursements give the flat fee at your own target margin, its effective hourly rate and the gap to what you charge today.
- **Matter tracker:** budget against actual hours and fees for hourly, flat and contingency matters, with variance %, realized rate, write-offs, recovery % and an over or under budget flag on every matter.
- **Lock-up, contingency and summary:** WIP days, debtor days, lock-up days and locked-up cash month by month; contingency fees split into gross fee, referral fee, net fee to the firm and net to the client; plus under-priced flat fees, matters over budget and the uplift at the computed fee.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
