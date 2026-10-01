import { describe, it, expect } from "vitest";
import { grossMargin, revenueForMargin } from "../public/calc.js";
describe("grossMargin", () => {
  it("computes gross profit, margin and markup", () => {
    const r = grossMargin({ revenue: 50000, cogs: 30000 });
    expect(r.grossProfit).toBe(20000); expect(r.marginPercent).toBe(40); expect(r.markupPercent).toBe(66.67);
  });
  it("reports a negative margin when cost exceeds revenue", () => {
    expect(grossMargin({ revenue: 100, cogs: 120 }).marginPercent).toBe(-20);
  });
  it("rejects zero revenue", () => {
    expect(() => grossMargin({ revenue: 0, cogs: 10 })).toThrow(/revenue/i);
  });
});
describe("revenueForMargin", () => {
  it("finds the revenue a target margin needs on the same cost", () => {
    expect(revenueForMargin({ cogs: 30000, targetMarginPercent: 50 })).toBe(60000);
  });
  it("rejects a margin of 100 or more", () => {
    expect(() => revenueForMargin({ cogs: 30000, targetMarginPercent: 100 })).toThrow(/margin/i);
  });
});
