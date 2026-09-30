import { describe, it, expect } from "vitest";
import { hourlyRate } from "../public/calc.js";

describe("hourly rate", () => {
  const base = { targetIncome: 60000, annualExpenses: 6000, weeksOff: 6, hoursPerWeek: 40, billablePercent: 60, taxPercent: 0 };
  it("computes billable hours and the rate needed", () => {
    // working weeks 46, hours 1840, billable 1104, need 66000 -> 59.78
    const r = hourlyRate(base);
    expect(r.workingWeeks).toBe(46);
    expect(r.billableHours).toBe(1104);
    expect(r.revenueNeeded).toBe(66000);
    expect(r.hourly).toBe(59.78);
    expect(r.day).toBe(478.24);
  });
  it("grosses up for tax when a tax percent is given", () => {
    // need 60000 net + 6000 expenses; at 25% tax revenue = 6000 + 60000/0.75 = 86000
    const r = hourlyRate({ ...base, taxPercent: 25 });
    expect(r.revenueNeeded).toBe(86000);
  });
  it("rejects zero billable hours", () => {
    expect(() => hourlyRate({ ...base, billablePercent: 0 })).toThrow(/billable/i);
    expect(() => hourlyRate({ ...base, weeksOff: 52 })).toThrow(/weeks/i);
  });
  it("rejects tax of 100 percent or more", () => {
    expect(() => hourlyRate({ ...base, taxPercent: 100 })).toThrow(/tax/i);
  });
});

describe("hourly rate (review fixes)", () => {
  const base = { targetIncome: 60000, annualExpenses: 6000, weeksOff: 6, hoursPerWeek: 40, billablePercent: 60, taxPercent: 0 };
  it("rejects zero hours per day, billable over 100 and more than 168 hours a week", () => {
    expect(() => hourlyRate({ ...base, hoursPerDay: 0 })).toThrow(/hours in a day/i);
    expect(() => hourlyRate({ ...base, billablePercent: 101 })).toThrow(/billable/i);
    expect(() => hourlyRate({ ...base, hoursPerWeek: 169 })).toThrow(/week/i);
  });
});
