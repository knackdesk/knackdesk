---
slug: saas-cost-calculator
name: Software Subscription Cost Calculator
lane: tool
status: live
category: planning
reviewed: 2026-10-01
headline: SaaS Cost Calculator: Monthly and Yearly Software Spend
tagline: Add up your software stack per month and per year, and see what annual plans would save
description: List your software subscriptions with monthly or annual pricing and seat counts; get the true monthly and yearly cost of the stack and the saving from switching to annual billing.
---
# Software Subscription Cost Calculator

**Audience:** freelancers, contractors and small business owners.
**Problem:** Nobody knows what their tool stack actually costs per year.
**Monetization:** AdSense (once approved) + kit cross-sell (automatic).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, form.tool, module script importing ./calc.js, showError helper, aria-live result, headings, "Is my data stored?" FAQ, Related tools list).
**Formulas and rules:**
- `stackCost({ items })` where each item = { name, price, period: "month"|"year", seats = 1, annualDiscountPercent = 0 }. For each: monthly = price*seats (if period month) or price*seats/12 (if year); yearly = monthly*12; annualPlanYearly = yearly*(1-annualDiscountPercent/100) only meaningful when period is month (potential saving = yearly - annualPlanYearly; 0 for yearly items). Return { items: [{name, monthly, yearly, saving}], totalMonthly, totalYearly, totalSaving } all round2.
- Validation: at least one item; price >= 0; seats integer >= 1; discount 0..100; period must be month or year; errors name the item.
- Page: a small editable table of 8 rows (name, price, period select, seats, annual discount %), prefilled with 3 example rows (e.g. design tool 20/month 1 seat 20%; accounting 30/month 1 seat 15%; domain 15/year); a results table per item + totals.
- Tests: [{price 20, month, seats 2, discount 20}] -> monthly 40, yearly 480, saving 96; [{price 120, year}] -> monthly 10, yearly 120, saving 0; totals sum; invalid period throws.
**Out of scope:** accounts, saving data, legal, tax or employment-law advice (state that rules vary; the tool does arithmetic with user-entered rates).
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
