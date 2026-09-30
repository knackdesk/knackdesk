import { describe, it, expect } from "vitest";
import { breakEven } from "../public/calc.js";

describe("break even", () => {
  it("fixed 5000, price 50, variable 30: 250 units, 12500 revenue, 40% CM ratio", () => {
    const r = breakEven({ fixedCosts: 5000, pricePerUnit: 50, variableCostPerUnit: 30 });
    expect(r).toEqual({ contributionMargin: 20, contributionMarginRatio: 40, units: 250, revenue: 12500 });
  });
  it("rounds units up to a whole unit", () => {
    const r = breakEven({ fixedCosts: 1000, pricePerUnit: 30, variableCostPerUnit: 14 });
    expect(r.units).toBe(63);
    expect(r.revenue).toBe(1890);
  });
  it("optionally includes a target profit", () => {
    const r = breakEven({ fixedCosts: 5000, pricePerUnit: 50, variableCostPerUnit: 30, targetProfit: 1000 });
    expect(r.units).toBe(300);
  });
  it("rejects price at or below variable cost", () => {
    expect(() => breakEven({ fixedCosts: 100, pricePerUnit: 10, variableCostPerUnit: 10 })).toThrow(/price/i);
  });
});

describe("break even (review fixes)", () => {
  it("uses integer cents so float noise never adds a unit", () => {
    // 0.1 + 0.2 style case: fixed 0.3, price 1.1, variable 1.0 -> margin 0.1 exactly -> 3 units
    expect(breakEven({ fixedCosts: 0.3, pricePerUnit: 1.1, variableCostPerUnit: 1.0 }).units).toBe(3);
  });
});
