import { describe, it, expect } from "vitest";
import { turnoverCost } from "../public/calc.js";

describe("turnover cost", () => {
  it("sums recruiting, vacancy, onboarding and ramp costs, then scales to a year", () => {
    const r = turnoverCost({ annualCost: 60000, workingDays: 240, recruitingCost: 5000, vacantDays: 30, onboardingCost: 2000, rampDays: 60, rampProductivityPercent: 50, headcount: 20, turnoverRatePercent: 15 });
    expect(r.dailyCost).toBe(250);
    expect(r.vacancyCost).toBe(7500);
    expect(r.rampCost).toBe(7500);
    expect(r.perLeaver).toBe(22000);
    expect(r.leaversPerYear).toBe(3);
    expect(r.perYear).toBe(66000);
    expect(r.percentOfSalary).toBe(36.67);
  });
  it("rejects zero working days", () => {
    expect(() => turnoverCost({ annualCost: 60000, workingDays: 0, recruitingCost: 0, vacantDays: 0, onboardingCost: 0, rampDays: 0, rampProductivityPercent: 50, headcount: 1, turnoverRatePercent: 10 })).toThrow(/working days/i);
  });
});
