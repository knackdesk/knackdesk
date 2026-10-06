---
polar_url: https://buy.polar.sh/polar_cl_xzHTD956LozjszlOivo0qH6JAPgn04a5bxvu23pDh8O
slug: salon-pricing-workbook
name: Salon & Appointment Pricing Workbook
lane: digital
category: pricing
price_cents: 1200
status: live
tagline: Price every service from your real hourly cost, settle booth rent vs commission and see what no-shows and empty slots cost you
description: An Excel and Google Sheets workbook for salon owners, stylists, barbers, beauty and massage therapists, trainers and tutors who sell their time by the appointment. Turn your overhead and income goal into a target hourly rate, see each service's floor and suggested price against what you charge, compare booth rent with commission at your own revenue, log no-shows and late cancellations week by week, and see how many appointments your week can hold. Formulas only, no macros.
---
# Salon & Appointment Pricing Workbook

**Audience:** salon owners, independent stylists and barbers, beauty and massage therapists, personal trainers, tutors and anyone who sells appointments.
**Problem:** prices get copied from the salon down the road instead of worked out from overhead, income goal and minutes in the chair; the booth rent vs commission choice is made on gut feel; and no-shows and empty slots quietly eat the week with nobody counting them.
**Monetization:** one-time purchase on Polar at 12 USD; cross-sold from the salon service price, booth rent, commission vs booth rent, no-show cost and appointment capacity pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Service Menu, Booth vs Commission, Weekly Log, Capacity, Summary; zipped with a README into `assets/salon-pricing-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** payroll, booking integration, tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what every appointment has to earn. The Salon & Appointment Pricing Workbook turns your overhead, income goal and hours into prices you can defend:
- **Service menu:** a target hourly rate from your own overhead and income goal, then each service's time cost, floor price, suggested price and the gap to what you charge today.
- **Booth vs commission:** monthly take-home under each model at your revenue, a plain verdict, the break-even revenue and five what-if revenue scenarios.
- **Weekly log:** appointments, no-shows and late cancellations each week with no-show rate, lost revenue, fees recovered and net, plus totals and a 4-week average.
- **Capacity and summary:** how many appointments fit your week, your revenue ceiling, services priced below floor and your best and worst margin services.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
