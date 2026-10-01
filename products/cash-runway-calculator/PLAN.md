---
slug: cash-runway-calculator
name: Cash Runway Calculator
lane: tool
status: live
category: planning
reviewed: 2026-10-01
headline: Cash Runway Calculator: Months Left and Run-Out Date
tagline: How many months your cash lasts at your current burn, and the date it runs out
description: Find how many months of runway you have from cash on hand, monthly income and monthly costs, and the month the money runs out, with the cut you would need to make to reach a target runway.
---
# Cash Runway Calculator

**Audience:** freelancers, contractors and small business owners.
**Problem:** Owners know their bank balance but not how many months it buys.
**Monetization:** AdSense (once approved) + kit cross-sell (automatic).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, form.tool, module script importing ./calc.js, showError helper, aria-live result, headings, "Is my data stored?" FAQ, Related tools list).
**Formulas and rules:**
- `runway({ cash, monthlyIncome, monthlyCosts, targetMonths? })`: burn = monthlyCosts - monthlyIncome. If burn <= 0 return { burn, months: null (infinite), runOutDate: null, costsForTarget: null }. Else months = round2(cash / burn); runOutDate = first day of current month + floor(months) months, as YYYY-MM (compute in UTC from a `today` param defaulting to new Date(), accept a YYYY-MM-DD string). If targetMonths given and > months: costsForTarget = round2(monthlyIncome + cash / targetMonths) i.e. the max monthly costs that give the target runway; cutNeeded = round2(monthlyCosts - costsForTarget).
- Validation: cash >= 0, income >= 0, costs >= 0; targetMonths > 0 if given. Errors mention the field name.
- Tests: cash 24000, income 3000, costs 7000 -> burn 4000, months 6; target 12 -> costsForTarget 5000, cutNeeded 2000. Income >= costs -> months null. Invalid inputs throw.
**Out of scope:** accounts, saving data, legal, tax or employment-law advice (state that rules vary; the tool does arithmetic with user-entered rates).
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
