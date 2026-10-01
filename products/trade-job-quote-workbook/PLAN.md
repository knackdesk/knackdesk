---
polar_url: https://buy.polar.sh/polar_cl_rPRP4PWuSTgLZ1N8e666QYzwKTurZS8mIGVqu0cqSJX
slug: trade-job-quote-workbook
name: Trade Job Quote & Change Order Workbook
lane: digital
category: pricing
price_cents: 1200
status: live
tagline: Quote jobs from materials, labour and subs with overhead and margin, log change orders with the three-figure format, and track what each job earned
description: An Excel and Google Sheets workbook for contractors and tradespeople. Build a quote line by line from materials, labour hours and subcontractors with your overhead and profit margin; log change orders with your markups and see the revised contract total after each one; and track every job's actual cost, profit, margin and outstanding balance with a summary across jobs. Formulas only, no macros.
---
# Trade Job Quote & Change Order Workbook

**Audience:** contractors, builders and tradespeople who quote jobs and get asked for extras.
**Problem:** the trades calculators price one job or one change at a time; the workbook keeps the quote, every change order and the job's actual result in one file.
**Monetization:** one-time purchase on Polar at 12 USD; cross-sold from the pricing pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Quote, Change Orders, Jobs, Summary; zipped with a README into `assets/trade-job-quote-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** scheduling, invoicing, tax, contract wording, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Quote it right, price every extra, and know what each job made. The Trade Job Quote & Change Order Workbook is a single workbook:
- **Quote builder:** materials by line with quantity and unit cost, labour tasks with hours at your cost rate, subcontractors; overhead and your profit margin roll up into the quote price, profit, markup and deposit.
- **Change orders:** one row per change with materials, hours and subs; your markup on own work and on subs gives the change price, the revised contract total after each change and the change as a share of the original.
- **Jobs:** quoted price plus change orders against actual materials, hours and subs; cost, overhead, profit, margin, invoiced, paid and outstanding per job.
- **Summary:** contract value, cost, profit and margin across jobs, outstanding balances, and how many jobs fell below your target margin.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
