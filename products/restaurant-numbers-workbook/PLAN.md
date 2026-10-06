---
polar_url: https://buy.polar.sh/polar_cl_WX8Gc8mmEPwOGXMhxBNudPx7kp8GfiTavHLrt48UEsz
slug: restaurant-numbers-workbook
name: Restaurant Numbers Workbook
lane: digital
category: pricing
price_cents: 1400
status: live
tagline: Cost every recipe, price every dish to your target food cost, and track prime cost and labour week by week
description: An Excel and Google Sheets workbook for independent restaurant, cafe and bistro owners. Cost each recipe line by line with a waste allowance, see every dish's food cost %, gross profit and the price that hits your target food cost, log weekly sales and costs to get prime cost %, food cost %, labour % and operating margin, plan staff hours against your target labour %, and see seat capacity in covers per week. Formulas only, no macros.
---
# Restaurant Numbers Workbook

**Audience:** owners and chefs of independent restaurants, cafes, bistros and small bars who cost recipes and track weekly numbers by hand or not at all.
**Problem:** food cost, labour and prime cost live in separate notebooks and calculators; menu prices drift from ingredient costs and nobody sees the weekly prime cost until the accountant does.
**Monetization:** one-time purchase on Polar at 14 USD; cross-sold from the restaurant pages (food cost percentage, recipe cost, prime cost, labour cost percentage, table turnover, bar cost).
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Recipes, Menu, Weekly P&L, Labour, Summary; zipped with a README into `assets/restaurant-numbers-workbook.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** inventory counts and ordering, POS integration, scheduling by shift, tip pooling, sales tax, industry benchmarks, macros.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what every plate earns. The Restaurant Numbers Workbook connects your recipes, menu prices, weekly sales and staff hours in one file:
- **Recipes and menu:** cost each recipe line by line with your waste allowance, then see each dish's food cost %, gross profit and the price that hits your target food cost.
- **Weekly P&L:** log sales, food, beverage and labour cost each week to get prime cost %, food cost %, labour % and operating margin, with running totals.
- **Labour:** staff hours and wages with payroll taxes added, labour % against projected sales and how many hours you are over or under your target.
- **Summary:** blended food cost %, best margin dish, the dish to re-price first, latest prime cost % and covers per week from your seats and turns.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
