---
polar_url: https://buy.polar.sh/polar_cl_Uag32G49MCJoGaCx0afdYnTx9NepArX3yfc5X2zpSaX
slug: dental-practice-numbers-workbook
name: Dental Practice Numbers Workbook
lane: digital
category: planning
price_cents: 1400
status: live
tagline: Track your dental practice's overhead percentage, production per hour, hygiene profit, chair utilization and cost per new patient month by month against your own targets
description: An Excel and Google Sheets workbook for dental practice owners and managers who want to know what the practice really earns. Log production, adjustments, collections and overhead each month to see collection rate, overhead % of collections, and profit before and after owner pay against your own target; track each dentist's production and profit per hour and the hygiene department's profit and margin. See chair utilization and the production left in idle chair hours, plus cost per new patient, lifetime value and break-even new patients from your marketing spend. Formulas only, no macros.
---
# Dental Practice Numbers Workbook

**Audience:** dentists, dental practice owners and practice managers; the overhead, production, chair and new-patient sheets also serve physiotherapy, veterinary, chiropractic and optometry clinics.
**Problem:** practices watch production but not collections, mix owner pay into overhead so the overhead percentage means nothing, never work out what a provider hour or the hygiene department actually earns once wages are loaded and overhead shared, leave chair hours idle without pricing the gap, and spend on marketing without knowing what a new patient costs or is worth.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the practice overhead percentage, production per hour, hygiene department profit, chair utilization and cost per new patient pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Monthly P&L, Provider Production, Hygiene, Chairs & New Patients, Summary; zipped with a README into `assets/dental-practice-numbers-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** clinical data, insurance claims, payroll, tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what your practice really earns, chair by chair and hour by hour. The Dental Practice Numbers Workbook turns your monthly figures into the numbers that run a practice:
- **Monthly P&L and overhead %:** gross production, adjustments and collections give net production and collection rate; wages loaded with payroll taxes plus rent, supplies and lab, marketing and other overhead give overhead % of collections, with owner pay kept separate so you see profit before and after it against your own target.
- **Provider production and hygiene:** each dentist's net production, production per hour and per day, overhead per provider hour and profit per hour; the hygiene department's loaded wages, total cost, profit, margin % and production and cost per hour against your target margin.
- **Chairs and new patients:** scheduled against available chair hours gives utilization %, idle hours and the production those empty hours leave on the table; marketing spend and new patients give cost per new patient, lifetime value, value-to-cost ratio and break-even new patients.
- **Summary:** year-to-date collections, overhead % against target, profit before and after owner pay, best and worst month, production per provider hour, hygiene margin, chair utilization, cost per new patient and the months overhead ran above target.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
