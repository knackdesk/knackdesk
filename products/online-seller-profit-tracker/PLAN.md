---
polar_url: https://buy.polar.sh/polar_cl_FbLUm3fh24VYerZhsTL8E8F7bGXNmfm5yuWhW1nIFR2
slug: online-seller-profit-tracker
name: Online Seller Profit Tracker
lane: digital
category: ecommerce
price_cents: 1200
status: live
tagline: Every order's real profit after fees and shipping, by month and by product, plus ad spend against break-even
description: An Excel and Google Sheets workbook for online sellers. Set your platform and payment fees once, list your products with cost and price, log orders, and see fees, shipping and profit per order, monthly totals, profit by product, and whether your ad spend beats the break-even return. Formulas only, no macros.
---
# Online Seller Profit Tracker

**Audience:** people selling physical products through a marketplace or their own shop.
**Problem:** the seller calculators answer one order at a time; the tracker applies the same fee logic to every order you log and rolls it up by month and product.
**Monetization:** one-time purchase on Polar at 12 USD; cross-sold from the ecommerce pages.
**Scope:** one .xlsx built by `src/build_kit.py` with sheets Start Here, Settings, Products, Orders, Summary, Ads; zipped with a README into `assets/online-seller-profit-tracker.zip`.
**Build:** build_kit.py → recalc.py (must report 0 errors) → re-zip.
**Out of scope:** macros, marketplace imports, tax, returns handling beyond a per-order field.
**Done when:** `npm test` passes, recalc reports zero errors, zip built, listed on Polar, LAUNCH.md ticked.

## Listing copy (Polar)
Know what each order really made, not what the dashboard says it sold. The Online Seller Profit Tracker is a single workbook:
- **Settings:** platform fee, payment fee and fixed fee, default packaging cost, entered once.
- **Products:** SKU, name, cost and price; orders look up cost and price automatically.
- **Orders:** one row per order with quantity, shipping charged and shipping paid; fees, revenue, profit and margin are calculated.
- **Summary:** revenue, fees, shipping, profit and margin by month, and profit by product.
- **Ads:** monthly ad spend against revenue and the break-even ROAS from your real margin.
Works in Excel, Google Sheets and Numbers. No macros, no sign-up, yours forever.
