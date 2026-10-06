---
polar_url: https://buy.polar.sh/polar_cl_rx5wrXHIjG7LX6PPAB9o56jnjH5wDZlqTEi123UNJGM
slug: msp-contract-pricing-workbook
name: MSP Contract Pricing Workbook
lane: digital
category: pricing
price_cents: 1400
status: live
tagline: See what every managed services contract really costs you in labour and tools, price per user at your own target margin and spot the clients losing you money
description: An Excel and Google Sheets workbook for managed service providers, IT support companies and freelance IT consultants who price support contracts. Turn technician salaries, payroll costs, productive hours and overhead into a loaded hourly cost, spread your per-user and per-device tool stack across contracts, and see each contract's total cost, gross margin, cost per user, price per user at your target margin and break-even support hours. Track cost per ticket month by month, quote block hours with expected unused hours and price onboarding fees against the contract they open. Formulas only, no macros.
---
# MSP Contract Pricing Workbook

**Audience:** managed service providers, IT support companies and freelance IT consultants pricing support contracts.
**Problem:** per-user and per-device prices get copied from a competitor or set once and never revisited while tool costs, device counts and support hours creep up; nobody knows the loaded cost of a technician hour, which contracts actually lose money, what a ticket costs, what prepaid block hours earn once some expire unused, or whether an onboarding fee covers the work.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the MSP per-user price, IT support contract margin, cost per ticket, block hours price and client onboarding fee pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Tool Stack, Contracts, Tickets, Blocks & Onboarding, Summary; zipped with a README into `assets/msp-contract-pricing-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → `build_kit.py --zip-only` to zip the recalculated xlsx.
**Out of scope:** PSA/RMM integration, ticketing, payroll, tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what every support contract has to earn. The MSP Contract Pricing Workbook turns your technicians, overhead and tool stack into contract prices you can defend:
- **Loaded hourly cost and tool stack:** salaries, payroll taxes and benefits, productive hours and overhead become the true cost of a technician hour; per-user and per-device tools are shared across contracts by users and devices, fixed tools kept apart.
- **Contract margins:** each client's shared and dedicated tool cost, labour, total cost, gross profit and margin %, cost and fee per user, the price per user at your target margin and the support hours a contract can absorb before it loses money.
- **Cost per ticket:** tickets closed and average minutes each month against technician, tool and overhead cost, with labour cost per ticket, tickets per technician and the share of productive hours spent on tickets.
- **Blocks, onboarding and summary:** block hours quotes with the effective rate on hours actually used, onboarding fees from hours, setup costs and margin with their share of the contract, plus contracts below target and your most and least profitable clients.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
