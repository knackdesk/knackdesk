---
slug: rental-yield-calculator
name: Rental Yield Calculator
lane: tool
status: live
category: property
reviewed: 2026-10-01
headline: Rental Yield Calculator: Gross and Net Yield on a Property
tagline: Gross and net rental yield from price, rent and running costs, plus monthly cash flow
description: Find the gross and net rental yield of a property from its price, monthly rent and yearly costs, and see the monthly cash flow after a mortgage payment if you have one.
---
# Rental Yield Calculator

**Audience:** tenants, landlords and small property investors.
**Problem:** Gross yield figures in listings hide the costs that make the real return much lower.
**Monetization:** AdSense (once approved); no kit cross-sell relevance yet (block still renders).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, definition and formula blocks after the intro, form.tool, module script with showError and disabled hidden wrappers, aria-live result, FAQ, Related tools).
**Formulas and rules:**
- `rentalYield({ price, monthlyRent, annualCosts = 0, vacancyWeeks = 0, monthlyMortgage = 0 })`: annualRent = monthlyRent*12 * (1 - vacancyWeeks/52); grossYield = annualRent_noVacancy/price*100 where annualRent_noVacancy = monthlyRent*12 (gross ignores vacancy and costs, standard definition); netIncome = annualRent - annualCosts; netYield = netIncome/price*100; monthlyCashFlow = (netIncome/12) - monthlyMortgage. All round2. price > 0; others >= 0; vacancyWeeks 0..52.
- Copy: gross yield = annual rent / purchase price; net yield deducts running costs (and vacancy); explain typical cost lines (insurance, maintenance, management fee, service charges, tax varies) without numbers presented as benchmarks.
- Tests: price 200000, rent 1000, costs 2400, vacancy 2 weeks, mortgage 500 -> grossYield 6, annualRent 11538.46, netIncome 9138.46, netYield 4.57, monthlyCashFlow 261.54; price 0 throws; vacancy 60 throws.
**Out of scope:** accounts, saving data, legal advice. Rent-control, deposit and notice rules vary by country and city; the copy must say so and the tool must only apply numbers the user enters.
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
