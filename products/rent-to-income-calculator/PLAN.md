---
slug: rent-to-income-calculator
name: Rent to Income Calculator
lane: tool
status: live
category: property
reviewed: 2026-10-01
headline: Rent to Income Ratio Calculator: Can You Afford the Rent?
tagline: Rent as a share of income, and the rent a given income supports at a target ratio
description: See what share of gross monthly income a rent takes, and the maximum rent for an income at a target ratio such as 30%, with the arithmetic shown.
---
# Rent to Income Calculator

**Audience:** tenants, landlords and small property investors.
**Problem:** Affordability rules of thumb get applied inconsistently to different incomes.
**Monetization:** AdSense (once approved); no kit cross-sell relevance yet (block still renders).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, definition and formula blocks after the intro, form.tool, module script with showError and disabled hidden wrappers, aria-live result, FAQ, Related tools).
**Formulas and rules:**
- `ratio({ monthlyIncome, monthlyRent })` -> { percent } round2; income > 0.
- `maxRent({ monthlyIncome, targetPercent })` -> { maxRent } round2; target 1..100.
- `incomeNeeded({ monthlyRent, targetPercent })` -> { income } round2.
- Accept annual income on the page via a select (monthly/annual) converted before calling (annual/12).
- Copy: the 30% figure is a common rule of thumb used by many landlords and agencies, not a law; some use 2.5x or 3x rent as income multiples (3x rent = 33%); do not state any as a requirement.
- Tests: income 4000, rent 1200 -> 30; income 4000 at 30% -> maxRent 1200; rent 1500 at 30% -> income 5000; income 0 throws; target 0 throws.
**Out of scope:** accounts, saving data, legal advice. Rent-control, deposit and notice rules vary by country and city; the copy must say so and the tool must only apply numbers the user enters.
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
