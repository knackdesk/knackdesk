---
slug: insurance-agency-numbers-workbook
name: Insurance Agency Numbers Workbook
lane: digital
category: planning
price_cents: 1400
status: live
polar_url: https://buy.polar.sh/polar_cl_dTKeTxhtzFIVnEX1r7BFsskgNAdnZ335zsmKc0MoQIF
tagline: Track policy retention and renewal commission by line, revenue per producer, cost per policy acquired and commission splits for your independent agency in one workbook
description: An Excel and Google Sheets workbook for independent insurance agency owners, managers and producers who want their own numbers in one place. Enter policies at the start of the year, lapses, new business and average premium for each line to see retention %, lapse %, net growth, the renewal commission on the retained book and the commission lost to lapses, all against your own target retention. Track each producer's commission revenue and compensation ratio, each month's cost per policy acquired against the lifetime commission a policy earns, and split every policy's commission between producer and agency with your own split % and per-policy fee. Formulas only, no macros.
---
# Insurance Agency Numbers Workbook

**Audience:** owners and managers of independent insurance agencies and brokerages, and individual producers who want to see their own book and splits.
**Problem:** retention is judged by feel instead of counted line by line, so the renewal commission walking out of the door with each lapse is never put into money; revenue per producer and producer compensation ratios are worked out once a year, if at all; marketing and lead spend are not divided by the policies they actually produced or set against the commission a policy earns over several years; and commission splits and per-policy agency fees are calculated by hand on each statement, so neither the producer nor the agency knows what they really keep.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the policy retention rate, renewal commission, revenue per producer, cost per policy acquired and agent commission split pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Book by Line, Producers, Acquisition, Commission Splits, Summary; zipped with a README into `assets/insurance-agency-numbers-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** agency management system data, carrier statements, compliance, licensing, valuation, tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what your book keeps, what each producer brings in and what a new policy is worth. The Insurance Agency Numbers Workbook turns your lines, producers, months and splits into numbers you can act on:
- **Book by Line:** policies at the start of the year, lapses, new business and average premium for each line give retention %, lapse %, net growth, the renewal commission on the retained book and the commission lost to lapses, with every line checked against your own target retention.
- **Producers:** policies, premium, commission revenue credited and compensation paid give revenue per policy and each producer's compensation ratio against your own target, with revenue per producer and per employee on the Summary.
- **Acquisition:** each month's marketing spend, lead costs and producer time give the cost per policy acquired, set against the lifetime commission a policy earns at your book's retention, with a value-to-cost ratio and payback policies.
- **Commission Splits:** premium, carrier commission %, agent split % and a per-policy agency fee give gross commission, agent net, the agent's effective % of premium and agency net, totalled per producer.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
