---
slug: home-care-pricing-workbook
name: Home Care Agency Pricing Workbook
lane: digital
category: pricing
price_cents: 1400
status: live
polar_url: https://buy.polar.sh/polar_cl_oqw0lThar2Ww98E12YUwwpCGaIhJAih1QzeIE2cvNXK
tagline: Work out what a billable care hour really costs, set a bill rate for every service level that hits your own margin and quote each care plan without overcommitting your caregivers
description: An Excel and Google Sheets workbook for home care agency owners who run companion, personal care, dementia, respite or live-in services. Turn caregiver pay, on-costs, paid travel and training time and monthly overhead into a cost per billable hour, then see the bill rate each service level needs to reach your own margin and the gap to what you charge today. Track caregiver utilization, quote every client's care plan with weekend, overnight and mileage charges, check committed hours against your team's capacity and count what caregiver turnover costs month by month. Formulas only, no macros.
---
# Home Care Agency Pricing Workbook

**Audience:** owners and managers of home care, domiciliary care, private-duty and companion care agencies; the service rate, utilization and turnover sheets also serve agency bookkeepers and consultants.
**Problem:** bill rates are set by copying a competitor or adding a flat amount to the pay rate, without counting on-costs, paid travel and training time and office overhead, so some service levels quietly lose money; care plans are quoted without pricing weekend, overnight and mileage hours consistently; new clients are accepted without checking whether the active caregivers can actually cover the hours; and caregiver turnover is felt as stress rather than counted as recruiting, onboarding and lost margin on unfilled hours.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the home care bill rate, caregiver utilization, client hours capacity, care plan quote and caregiver turnover cost pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Service Rates, Caregivers, Clients & Quotes, Capacity & Turnover, Summary; zipped with a README into `assets/home-care-pricing-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** scheduling, electronic visit verification, payroll, care planning, tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what every care hour costs and what every client has to pay. The Home Care Agency Pricing Workbook turns your caregivers, overhead, service levels and clients into rates you can defend:
- **Cost per billable hour:** caregiver pay, on-costs, paid travel and training time and six lines of monthly overhead become a cost per billable hour and a default bill rate at your own target margin.
- **Service rates:** pay rate, on-costs % and margin % for companion, personal care, dementia care, respite, live-in and your own levels give the bill rate each one needs, the margin per hour and the gap to what you charge today, with under-priced levels counted.
- **Caregivers and care plan quotes:** paid, billable, travel and training hours give each caregiver's utilization against your own target; each client's hours, weekend and overnight hours and mileage give a weekly and period quote and the effective hourly rate.
- **Capacity and turnover:** billable capacity at your target utilization against hours committed to active clients, spare hours and revenue ceiling; plus leavers, hires, recruiting, onboarding and unfilled hours month by month with turnover % and turnover cost.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
