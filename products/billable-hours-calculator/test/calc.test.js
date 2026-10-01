import { describe, it, expect } from "vitest";
import { billableTarget } from "../public/calc.js";
describe("billableTarget", () => {
  it("converts a revenue goal into hours per year, week and day", () => {
    const r = billableTarget({ revenueGoal: 120000, hourlyRate: 100, weeksWorked: 46, hoursPerWeek: 40, daysPerWeek: 5 });
    expect(r.hoursNeeded).toBe(1200); expect(r.perWeek).toBe(26.09); expect(r.perDay).toBe(5.22); expect(r.utilizationPercent).toBe(65.22); expect(r.feasible).toBe(true);
  });
  it("flags an infeasible goal", () => {
    const r = billableTarget({ revenueGoal: 300000, hourlyRate: 100, weeksWorked: 46, hoursPerWeek: 40, daysPerWeek: 5 });
    expect(r.utilizationPercent).toBeGreaterThan(100); expect(r.feasible).toBe(false);
  });
  it("rejects a zero rate", () => {
    expect(() => billableTarget({ revenueGoal: 1000, hourlyRate: 0, weeksWorked: 46, hoursPerWeek: 40, daysPerWeek: 5 })).toThrow(/rate/i);
  });
  it("rejects zero weeks", () => {
    expect(() => billableTarget({ revenueGoal: 1000, hourlyRate: 100, weeksWorked: 0, hoursPerWeek: 40, daysPerWeek: 5 })).toThrow(/weeks/i);
  });
});
