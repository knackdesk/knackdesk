---
slug: block-hours-price-calculator
name: Block Hours Price Calculator
lane: tool
status: live
category: pricing
kits: msp-contract-pricing-workbook
reviewed: 2026-10-06
headline: Block Hours Price Calculator: Price Prepaid Support Hours
tagline: Turn block hours, your rate, a prepay discount, expiry and expected unused hours into the block price, effective rates and the price per month
description: Price a prepaid block of support hours from the hours, your rate, a discount and expiry, and see the rate you really earn once expected unused hours expire.
---
# Block Hours Price Calculator

**Audience:** managed service providers (MSPs), IT support companies and freelance IT consultants who sell prepaid blocks of support time.
**Problem:** Discounted blocks with expiry change the real rate on both sides; unused hours (breakage) raise what the client pays per hour used and the rate you deliver at.
**Monetization:** AdSense + pricing kit cross-sell.
**Scope:** client-side calculator, pure tested functions, 650+ word explainer with FAQ. Formulas: list price = hours × rate; block price = list × (1 − discount % ÷ 100); effective rate = block price ÷ hours; expected used hours = hours × (1 − unused % ÷ 100); rate on used hours = block price ÷ used hours (null when 0); per month = block price ÷ expiry months (null when 0). Rejects 0 hours, discount above 100, unused above 100.
**Out of scope:** industry benchmarks, typical prices, averages or ranges, target percentages, tax, saving data.
**Done when:** tests pass, page renders, LAUNCH.md ticked.
