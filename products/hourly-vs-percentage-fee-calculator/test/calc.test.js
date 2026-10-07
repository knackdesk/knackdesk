import { describe, it, expect } from "vitest";
import { hourlyVsPercentageFee } from "../public/calc.js";
describe("hourlyVsPercentageFee", () => {
  it("compares a percentage fee with hourly billing, an overrun and the break-even hours", () => {
    const r = hourlyVsPercentageFee({ projectBudget: 120000, percentageFee: 15, estimatedHours: 150, hourlyRate: 110, overrunPercent: 20 });
    expect(r.percentageFeeAmount).toBe(18000); expect(r.hourlyFeeAmount).toBe(16500); expect(r.difference).toBe(1500);
    expect(r.impliedHourlyRate).toBe(120); expect(r.hourlyFeeAtOverrun).toBe(19800); expect(r.breakEvenHours).toBe(163.64);
  });
  it("assumes no overrun by default", () => {
    const r = hourlyVsPercentageFee({ projectBudget: 50000, percentageFee: 10, estimatedHours: 40, hourlyRate: 100 });
    expect(r.percentageFeeAmount).toBe(5000); expect(r.hourlyFeeAmount).toBe(4000); expect(r.hourlyFeeAtOverrun).toBe(4000);
    expect(r.impliedHourlyRate).toBe(125); expect(r.breakEvenHours).toBe(50);
  });
  it("returns a negative difference when hourly billing pays more", () => {
    const r = hourlyVsPercentageFee({ projectBudget: 20000, percentageFee: 10, estimatedHours: 30, hourlyRate: 100 });
    expect(r.difference).toBe(-1000);
  });
  it("returns null for the implied hourly rate when there are no hours", () => {
    const r = hourlyVsPercentageFee({ projectBudget: 10000, percentageFee: 10, estimatedHours: 0, hourlyRate: 100 });
    expect(r.impliedHourlyRate).toBeNull(); expect(r.hourlyFeeAmount).toBe(0); expect(r.breakEvenHours).toBe(10);
  });
  it("returns null for the break-even hours when the hourly rate is 0", () => {
    const r = hourlyVsPercentageFee({ projectBudget: 10000, percentageFee: 10, estimatedHours: 20, hourlyRate: 0 });
    expect(r.breakEvenHours).toBeNull(); expect(r.impliedHourlyRate).toBe(50);
  });
  it("rejects a percentage fee above 100", () => {
    expect(() => hourlyVsPercentageFee({ projectBudget: 10000, percentageFee: 101, estimatedHours: 20, hourlyRate: 100 })).toThrow("Percentage fee cannot be more than 100.");
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => hourlyVsPercentageFee({ projectBudget: -1, percentageFee: 10, estimatedHours: 20, hourlyRate: 100 })).toThrow(/0 or more/);
    expect(() => hourlyVsPercentageFee({ projectBudget: 1000, percentageFee: NaN, estimatedHours: 20, hourlyRate: 100 })).toThrow(/0 or more/);
    expect(() => hourlyVsPercentageFee({ projectBudget: 1000, percentageFee: 10, estimatedHours: 20, hourlyRate: 100, overrunPercent: -1 })).toThrow(/0 or more/);
    expect(() => hourlyVsPercentageFee({})).toThrow(/0 or more/);
  });
});
