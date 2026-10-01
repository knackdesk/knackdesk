---
slug: rent-increase-calculator
name: Rent Increase Calculator
lane: tool
status: live
category: property
reviewed: 2026-10-01
headline: Rent Increase Calculator: New Rent and Percent Change
tagline: New rent from a percentage increase, the percentage between two rents, and the yearly cost of the change
description: Calculate a new rent from a percentage or fixed increase, the percentage between an old and new rent, and what the change costs or earns per year.
---
# Rent Increase Calculator

**Audience:** tenants, landlords and small property investors.
**Problem:** Rent increase letters quote a figure without the percentage, and tenants cannot tell how big it is.
**Monetization:** AdSense (once approved); no kit cross-sell relevance yet (block still renders).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, definition and formula blocks after the intro, form.tool, module script with showError and disabled hidden wrappers, aria-live result, FAQ, Related tools).
**Formulas and rules:**
- `applyIncrease({ rent, percent })` -> { newRent, monthlyDifference, yearlyDifference } round2.
- `percentBetween({ oldRent, newRent })` -> { percent, monthlyDifference, yearlyDifference }; oldRent > 0.
- `capCheck({ oldRent, newRent, capPercent })` -> { percent, capPercent, withinCap: boolean, maxRentAtCap } where maxRentAtCap = round2(oldRent*(1+capPercent/100)); this is arithmetic only: the user enters the cap that applies to them (copy: caps vary and may not exist; check local rules).
- Page: mode select (apply / between / cap).
- Tests: 1200 +5% -> 1260, +60/month, +720/year; 1200->1300 -> 8.33%; cap 1200->1300 at 5% -> withinCap false, maxRentAtCap 1260; oldRent 0 throws.
**Out of scope:** accounts, saving data, legal advice. Rent-control, deposit and notice rules vary by country and city; the copy must say so and the tool must only apply numbers the user enters.
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
