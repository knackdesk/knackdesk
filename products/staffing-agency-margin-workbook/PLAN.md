---
polar_url: https://buy.polar.sh/polar_cl_FCWmR09gYEyk27YIIRtkeWTVIpwNq92KP4lG11teQZZ
slug: staffing-agency-margin-workbook
name: Staffing Agency Margin Workbook
lane: digital
category: pricing
price_cents: 1400
status: live
tagline: Work out what every recruiter desk costs, see the real margin on each perm placement and temp assignment and hold back the right reserve for guarantee rebates
description: An Excel and Google Sheets workbook for recruitment and staffing agency owners who place permanent candidates, run temps and contractors, or both. Turn recruiter salaries, benefits, tools, job boards and overhead into a desk cost per recruiter and a cost per hour, then see the net fee after splits, delivery cost and margin % on every permanent placement, and the bill rate, loaded cost and gross margin per hour on every temp assignment. Track job orders, fill rate, days to fill and desk profit month by month, and set aside a rebate reserve for each placement still in its guarantee. Formulas only, no macros.
---
# Staffing Agency Margin Workbook

**Audience:** owners and managers of recruitment and staffing agencies, and independent recruiters; the desk cost, temp margin and rebate reserve sheets also serve agency bookkeepers and consultants.
**Problem:** perm fees are quoted as a % of salary without knowing what a recruiter hour costs, so split placements and long searches quietly lose money; temp markups are set on pay without seeing that on-costs leave a much thinner margin on the bill rate; desk performance is judged by fees alone rather than against the cost of running the desk; and guarantee rebates arrive as a surprise because nothing was held back when the fee came in.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the placement fee, temp staffing margin, recruiter desk cost, fill rate and guarantee rebate reserve pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Perm Placements, Temp Assignments, Desk Performance, Rebate Reserve, Summary; zipped with a README into `assets/staffing-agency-margin-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** payroll, timesheets, applicant tracking, tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what every desk, placement and temp hour has to earn. The Staffing Agency Margin Workbook turns your recruiters, overhead, placements and assignments into margins you can see:
- **Desk cost per recruiter:** salaries, benefits and payroll taxes, tools, job boards and overhead become a desk cost per recruiter and a cost per hour, with the break-even placements each recruiter needs a year.
- **Perm placements:** fee % of salary, split fees, recruiter hours at your own cost per hour and advertising give the net fee, delivery cost, margin and margin % on every placement, with a flag for the ones below your own threshold.
- **Temp assignments:** pay rate, on-costs and markup, or a bill rate you agreed, give the loaded cost, gross margin per hour, margin % on bill and the margin over the whole assignment, with the thinnest assignment picked out.
- **Desk performance and rebate reserve:** job orders, fill rate, days to fill, submittals per fill, gross margin and desk profit month by month; plus a reserve for each placement under guarantee with what is still held, released and paid back.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
