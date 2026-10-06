import { describe, it, expect } from "vitest";
import { commissionVsBoothRent } from "../public/calc.js";
describe("commissionVsBoothRent", () => {
  it("compares commission take-home with booth rent take-home and finds the break-even revenue", () => {
    const r = commissionVsBoothRent({ monthlyRevenue: 7000, commissionPercent: 45, weeklyBoothRent: 300, productCostPercent: 10 });
    expect(r.commissionTakeHome).toBe(3150); expect(r.boothRentMonthly).toBe(1300); expect(r.boothTakeHome).toBe(5000);
    expect(r.difference).toBe(1850); expect(r.breakEvenRevenue).toBe(2888.89);
  });
  it("assumes no product cost by default", () => {
    const r = commissionVsBoothRent({ monthlyRevenue: 3000, commissionPercent: 50, weeklyBoothRent: 0 });
    expect(r.boothTakeHome).toBe(3000); expect(r.difference).toBe(1500); expect(r.breakEvenRevenue).toBe(0);
  });
  it("returns null break-even when commission and product cost leave nothing to cover rent", () => {
    const r = commissionVsBoothRent({ monthlyRevenue: 7000, commissionPercent: 95, weeklyBoothRent: 300, productCostPercent: 10 });
    expect(r.breakEvenRevenue).toBeNull();
  });
  it("gives a negative difference when commission pays more", () => {
    const r = commissionVsBoothRent({ monthlyRevenue: 2000, commissionPercent: 45, weeklyBoothRent: 300, productCostPercent: 10 });
    expect(r.difference).toBeLessThan(0);
  });
  it("rejects percentages above 100", () => {
    expect(() => commissionVsBoothRent({ monthlyRevenue: 7000, commissionPercent: 101, weeklyBoothRent: 300 })).toThrow(/commission/i);
    expect(() => commissionVsBoothRent({ monthlyRevenue: 7000, commissionPercent: 45, weeklyBoothRent: 300, productCostPercent: 101 })).toThrow(/product cost/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => commissionVsBoothRent({ monthlyRevenue: -1, commissionPercent: 45, weeklyBoothRent: 300 })).toThrow(/0 or more/);
    expect(() => commissionVsBoothRent({ monthlyRevenue: 7000, commissionPercent: 45, weeklyBoothRent: NaN })).toThrow(/0 or more/);
  });
});
