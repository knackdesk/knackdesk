import { describe, it, expect } from "vitest";
import { employeeCost } from "../public/calc.js";

describe("employee cost", () => {
  it("adds employer taxes, benefits and overheads and divides by productive hours", () => {
    const r = employeeCost({ salary: 50000, employerTaxPercent: 12, benefits: 4000, overheads: 3000, weeksWorked: 46, hoursPerWeek: 40, productivePercent: 80 });
    expect(r.employerTaxes).toBe(6000);
    expect(r.totalAnnual).toBe(63000);
    expect(r.totalMonthly).toBe(5250);
    expect(r.productiveHours).toBe(1472);
    expect(r.costPerProductiveHour).toBe(42.8);
    expect(r.multiplier).toBe(1.26);
  });
  it("rejects zero productive hours", () => {
    expect(() => employeeCost({ salary: 50000, employerTaxPercent: 12, benefits: 0, overheads: 0, weeksWorked: 0, hoursPerWeek: 40, productivePercent: 80 })).toThrow(/hours/i);
  });
});
