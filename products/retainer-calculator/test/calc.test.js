import { describe, it, expect } from "vitest";
import { retainer } from "../public/calc.js";

describe("retainer", () => {
  it("prices hours times rate with a commitment discount", () => {
    const r = retainer({ hoursPerMonth: 20, hourlyRate: 100, discountPercent: 10, months: 12 });
    expect(r.listPrice).toBe(2000);
    expect(r.monthlyFee).toBe(1800);
    expect(r.effectiveRate).toBe(90);
    expect(r.termTotal).toBe(21600);
  });
  it("rejects zero hours and discount of 100 or more", () => {
    expect(() => retainer({ hoursPerMonth: 0, hourlyRate: 100, discountPercent: 0, months: 1 })).toThrow(/hours/i);
    expect(() => retainer({ hoursPerMonth: 1, hourlyRate: 100, discountPercent: 100, months: 1 })).toThrow(/discount/i);
  });
});
