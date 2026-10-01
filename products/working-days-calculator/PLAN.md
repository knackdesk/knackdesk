---
slug: working-days-calculator
name: Working Days Calculator
lane: tool
status: live
category: time
reviewed: 2026-10-01
headline: Working Days Calculator: Business Days Between Two Dates
tagline: Count working days between two dates, or add working days to a date, skipping weekends and your own holidays
description: Count the working days between two dates, or find the date a number of working days from today, skipping weekends and any holiday dates you list.
---
# Working Days Calculator

**Audience:** freelancers, contractors and small business owners.
**Problem:** Deadlines get quoted in working days and nobody counts them the same way.
**Monetization:** AdSense (once approved) + kit cross-sell (automatic).
**Scope:** one client-side calculator (public/index.html + public/calc.js), pure functions unit-tested in test/calc.test.js, 600+ word explainer with FAQ and related-tools block. Follow the exact structure of products/discount-calculator (meta comments, form.tool, module script importing ./calc.js, showError helper, aria-live result, headings, "Is my data stored?" FAQ, Related tools list).
**Formulas and rules:**
- `workingDaysBetween({ start, end, holidays = [] , includeEnd = true })`: dates as YYYY-MM-DD strings, UTC only; count Mon-Fri days from start to end inclusive of end when includeEnd (and inclusive of start); exclude any date in holidays (array of YYYY-MM-DD). Throw if end < start or an invalid date. Return { workingDays, calendarDays, weekendDays, holidayDays }.
- `addWorkingDays({ start, days, holidays = [] })`: move forward `days` working days (skip Sat/Sun and holidays); days must be an integer 0..3650; return YYYY-MM-DD. Cap enforced with a clear error.
- Also export `localIsoDate(d = new Date())` for the page default.
- Tests: 2026-10-05 (Mon) to 2026-10-09 (Fri) -> 5 working days, 5 calendar, 0 weekend; 2026-10-05 to 2026-10-12 -> 6 working, 8 calendar, 2 weekend; with holidays ["2026-10-07"] -> 5 working, holidayDays 1. addWorkingDays 2026-10-09 + 1 -> 2026-10-12; + 1 with holiday 2026-10-12 -> 2026-10-13. end before start throws.
**Out of scope:** accounts, saving data, legal, tax or employment-law advice (state that rules vary; the tool does arithmetic with user-entered rates).
**Done when:** tests pass, page renders in the site build, copy proofread, LAUNCH.md ticked.
