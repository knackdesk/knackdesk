---
slug: prorated-rent-calculator
name: Prorated Rent Calculator
lane: tool
status: live
category: property
reviewed: 2026-10-01
headline: Prorated Rent Calculator: Move-In and Move-Out by Day
tagline: Rent for a partial month when you move in or out mid-month, by daily rate
description: Work out prorated rent for a partial first or last month from the monthly rent and the move-in or move-out date, using the actual days in that month or a 30-day month.
---
# Prorated Rent Calculator

**Audience:** tenants, landlords and small property investors.
**Problem:** Partial-month rent gets argued over because people use different day counts.
**Monetization:** AdSense (once approved); no kit cross-sell relevance yet (block still renders).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, definition and formula blocks after the intro, form.tool, module script with showError and disabled hidden wrappers, aria-live result, FAQ, Related tools).
**Formulas and rules:**
- `proratedRent({ monthlyRent, date, mode: "move-in"|"move-out", basis: "actual"|"30" })`: date is YYYY-MM-DD (UTC). daysInMonth = actual days of that month, or 30 if basis "30". daysCharged: move-in = daysInMonth(actual) - day + 1 (the move-in day counts); move-out = day (the move-out day counts). dailyRate = monthlyRent / daysInMonth(basis); prorated = round2(dailyRate * daysCharged). Return { daysInMonth, daysCharged, dailyRate (round2), prorated }. For basis "30" with a 31-day month and a move-in on the 31st, daysCharged is 1 and is still charged (document). Validate rent >= 0, valid date (round-trip check), mode and basis values.
- Also `localIsoDate()` for the page default.
- Tests: rent 1500, move-in 2026-10-11, actual -> daysInMonth 31, daysCharged 21, dailyRate 48.39, prorated 1016.13; same with basis 30 -> dailyRate 50, prorated 1050; move-out 2026-02-10 (2026 not leap) actual -> daysInMonth 28, charged 10, prorated 535.71; invalid date throws; bad mode throws.
**Out of scope:** accounts, saving data, legal advice. Rent-control, deposit and notice rules vary by country and city; the copy must say so and the tool must only apply numbers the user enters.
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
