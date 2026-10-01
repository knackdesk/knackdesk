---
slug: commission-calculator
name: Sales Commission Calculator
lane: tool
status: live
tagline: Commission on a sale at a flat rate or in tiers, and the sale needed to hit a commission target
description: Work out commission at a flat percentage or with tiered rates, see the effective rate, and find the sales total needed to earn a target commission.
---
# Sales Commission Calculator

**Audience:** freelancers, contractors and small business owners.
**Problem:** Commission plans with tiers are hard to work out by hand.
**Monetization:** AdSense (once approved) + kit cross-sell (automatic).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, form.tool, module script importing ./calc.js, showError helper, aria-live result, headings, "Is my data stored?" FAQ, Related tools list).
**Formulas and rules:**
- `flatCommission({ amount, ratePercent })` -> { commission, effectiveRate } round2.
- `tieredCommission({ amount, tiers })` where tiers = [{ upTo: number|null, ratePercent }] applied progressively (marginal): e.g. tiers [{upTo 10000, 5}, {upTo 50000, 8}, {upTo null, 10}] on 60000 -> 500 + 3200 + 1000 = 4700; effectiveRate = commission/amount*100 round2. Tiers must have ascending upTo with the last null; validate.
- `salesForTarget({ targetCommission, ratePercent })` -> round2(target / (rate/100)); rate > 0.
- Page: mode select (flat / tiered / target); tiered mode shows 3 tier rows (up to, rate) prefilled with the example; results show commission, effective rate, and in tiered mode a per-tier breakdown table.
- Tests: flat 25000 at 7% -> 1750; tiered example above -> 4700 and 7.83%; amount inside first tier (5000) -> 250; target 3000 at 6% -> 50000; descending tiers throw; rate 0 for target throws.
**Out of scope:** accounts, saving data, legal, tax or employment-law advice (state that rules vary; the tool does arithmetic with user-entered rates).
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
