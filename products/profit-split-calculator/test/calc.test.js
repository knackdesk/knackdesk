import { describe, it, expect } from "vitest";
import { profitSplit } from "../public/calc.js";
describe("profitSplit", () => {
  it("splits by percentage shares", () => {
    const r = profitSplit({ profit: 30000, reservePercent: 0, shares: [50, 30, 20] });
    expect(r.reserve).toBe(0); expect(r.distributable).toBe(30000); expect(r.payouts).toEqual([15000, 9000, 6000]);
  });
  it("holds back a reserve first", () => {
    const r = profitSplit({ profit: 30000, reservePercent: 10, shares: [50, 50] });
    expect(r.reserve).toBe(3000); expect(r.distributable).toBe(27000); expect(r.payouts).toEqual([13500, 13500]);
  });
  it("rejects shares that do not total 100", () => {
    expect(() => profitSplit({ profit: 100, reservePercent: 0, shares: [60, 50] })).toThrow(/100/);
  });
  it("rejects an empty share list", () => {
    expect(() => profitSplit({ profit: 100, reservePercent: 0, shares: [] })).toThrow(/partner/i);
  });
});
