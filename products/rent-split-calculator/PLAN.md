---
slug: rent-split-calculator
name: Rent Split Calculator
lane: tool
status: live
category: property
reviewed: 2026-10-01
headline: Rent Split Calculator: Fair Shares by Room Size or Income
tagline: Split rent between flatmates equally, by room size, or by income
description: Split a shared rent between two to six people equally, in proportion to room size, or in proportion to income, with each share and the check that they add up.
---
# Rent Split Calculator

**Audience:** tenants, landlords and small property investors.
**Problem:** Flatmates with different rooms or incomes argue about what a fair split is.
**Monetization:** AdSense (once approved); no kit cross-sell relevance yet (block still renders).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, definition and formula blocks after the intro, form.tool, module script with showError and disabled hidden wrappers, aria-live result, FAQ, Related tools).
**Formulas and rules:**
- `splitRent({ totalRent, people: [{ name, weight }], method: "equal"|"weighted" })`: equal -> each = totalRent/n; weighted -> each = totalRent * weight/sum(weights) (weight = room size in m2 or income). Round each to cents and make the shares sum exactly to totalRent by adjusting the last share (document). Return { shares: [{ name, weight, share, percent }], total }. 2..6 people; weights > 0 for weighted; totalRent > 0; names default "Person N".
- Page: total rent, method select, 6 rows (name, weight label changes with method: "Room size (m²)" / "Monthly income"), empty rows ignored; results table with name, share, percent; totals row.
- Tests: 1500 equal 3 -> 500 each; 1500 weighted weights 10,20 -> 500, 1000; weights 1,1,1 on 1000 -> 333.33, 333.33, 333.34 (sums to 1000); one person throws; weight 0 in weighted throws.
**Out of scope:** accounts, saving data, legal advice. Rent-control, deposit and notice rules vary by country and city; the copy must say so and the tool must only apply numbers the user enters.
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
