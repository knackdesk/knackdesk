---
polar_url: https://buy.polar.sh/polar_cl_57pIQcc5seQAoQqY3uUYAuJdPJdGYmyD6RH6Y3t3lta
slug: event-catering-quote-workbook
name: Event & Catering Quote Workbook
lane: digital
category: pricing
price_cents: 1200
status: live
tagline: Quote any event at your target margin, with staffing, bar and deposit worked out, then track what each event really earned
description: An Excel and Google Sheets workbook for caterers, event planners and venue operators. Enter guests, hours, menu cost per guest and rentals to get the servers and bartenders you need, a drinks estimate by beer, wine and spirits, the total cost, the price at your target margin, the price per guest, the deposit and the balance due; then log each event's quoted price against actual costs to see profit, margin, what is still owed and which events fell below your target. Formulas only, no macros.
---
# Event & Catering Quote Workbook

**Audience:** small caterers, private chefs, event planners and venue operators who quote events of 20 to 500 guests by hand.
**Problem:** per-guest food cost is easy; staffing hours, the bar, rentals and a price that actually hits a margin are where quotes go wrong, and few owners check afterwards whether the event earned what was quoted.
**Monetization:** one-time purchase on Polar at 12 USD; cross-sold from the pricing pages (markup and margin, price per guest, deposit).
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Quote, Bar, Events, Summary; zipped with a README into `assets/event-catering-quote-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** recipe costing and ingredient quantities, sales tax and service charge rules, invoicing, booking calendars, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Stop guessing event prices. The Event & Catering Quote Workbook turns guests, hours and your menu into a price that hits your margin:
- **Quote:** menu cost per guest, rentals and other costs, servers and bartenders from your staffing ratios, then total cost, price at your target margin, price per guest, deposit and balance due.
- **Bar:** a drinks estimate from guests and hours, split by beer, wine and spirits with your cost per serving, with a check that the shares add up.
- **Events:** log every event's quoted price against actual food, staffing, bar and rental costs to see profit, margin and what is still outstanding.
- **Summary:** quoted total, profit, margin, average price per guest and how many events fell below your target margin.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
