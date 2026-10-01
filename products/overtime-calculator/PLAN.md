---
slug: overtime-calculator
name: Overtime Pay Calculator
lane: tool
status: live
category: time
reviewed: 2026-10-01
headline: Overtime Pay Calculator: Time and a Half and Double Time
tagline: Overtime pay from hours over a threshold, your base rate and a multiplier, plus the total for the period
description: Calculate overtime pay from the hours worked over a weekly threshold, the base hourly rate and an overtime multiplier such as 1.5, and see regular pay, overtime pay and the total.
---
# Overtime Pay Calculator

**Audience:** freelancers, contractors and small business owners.
**Problem:** Overtime gets estimated with the wrong multiplier or threshold.
**Monetization:** AdSense (once approved) + kit cross-sell (automatic).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, form.tool, module script importing ./calc.js, showError helper, aria-live result, headings, "Is my data stored?" FAQ, Related tools list).
**Formulas and rules:**
- `overtime({ hoursWorked, thresholdHours = 40, hourlyRate, multiplier = 1.5, doubleTimeAfter = null, doubleMultiplier = 2 })`: regularHours = min(hoursWorked, threshold); overtimeHours = max(0, hoursWorked - threshold); if doubleTimeAfter given and hoursWorked > doubleTimeAfter: doubleHours = hoursWorked - doubleTimeAfter, overtimeHours = doubleTimeAfter - threshold (not below 0). regularPay = regularHours*rate; overtimePay = overtimeHours*rate*multiplier; doublePay = doubleHours*rate*doubleMultiplier; total = sum; all round2. Return { regularHours, overtimeHours, doubleHours, regularPay, overtimePay, doublePay, total, effectiveRate (total/hoursWorked) }.
- Validation: hours >= 0 and <= 168; threshold >= 0; rate >= 0; multiplier >= 1; doubleTimeAfter > threshold if given.
- Copy must say overtime rules (thresholds, multipliers, exemptions) are set by local law and contracts and vary; the tool only applies the numbers you enter.
- Tests: 48h, threshold 40, rate 20, x1.5 -> regular 800, overtime 240, total 1040, effective 21.67; 60h with doubleTimeAfter 50 -> overtime 10h (300), double 10h (400), total 800+300+400=1500; 35h -> no overtime; multiplier 0.5 throws; 200h throws.
**Out of scope:** accounts, saving data, legal, tax or employment-law advice (state that rules vary; the tool does arithmetic with user-entered rates).
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
