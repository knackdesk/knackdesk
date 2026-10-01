import { describe, it, expect } from "vitest";
import { raiseByPercent, raiseByAmount, raiseBetween } from "../public/calc.js";

describe("pay raise", () => {
  it("applies a percentage raise", () => {
    const r = raiseByPercent({ salary: 48000, percent: 5, hoursPerWeek: 40 });
    expect(r.newSalary).toBe(50400);
    expect(r.difference).toBe(2400);
    expect(r.monthlyDifference).toBe(200);
    expect(r.hourlyDifference).toBe(1.15);
  });
  it("applies a fixed raise and reports the percent", () => {
    const r = raiseByAmount({ salary: 48000, amount: 3000, hoursPerWeek: 40 });
    expect(r.newSalary).toBe(51000);
    expect(r.percent).toBe(6.25);
  });
  it("finds the raise between two salaries", () => {
    expect(raiseBetween({ oldSalary: 48000, newSalary: 50400, hoursPerWeek: 40 }).percent).toBe(5);
  });
  it("rejects zero salary", () => {
    expect(() => raiseByPercent({ salary: 0, percent: 5, hoursPerWeek: 40 })).toThrow(/salary/i);
  });
});
