import { describe, it, expect } from "vitest";
import { stackCost } from "../public/calc.js";

describe("software stack cost", () => {
  it("costs a monthly multi-seat plan and its annual saving", () => {
    const r = stackCost({ items: [{ name: "Design", price: 20, period: "month", seats: 2, annualDiscountPercent: 20 }] });
    expect(r.items[0]).toEqual({ name: "Design", monthly: 40, yearly: 480, saving: 96 });
  });
  it("spreads a yearly plan over 12 months with no saving", () => {
    const r = stackCost({ items: [{ name: "Domain", price: 120, period: "year" }] });
    expect(r.items[0]).toEqual({ name: "Domain", monthly: 10, yearly: 120, saving: 0 });
  });
  it("sums totals", () => {
    const r = stackCost({ items: [
      { name: "Design", price: 20, period: "month", seats: 2, annualDiscountPercent: 20 },
      { name: "Domain", price: 120, period: "year" },
    ] });
    expect(r.totalMonthly).toBe(50);
    expect(r.totalYearly).toBe(600);
    expect(r.totalSaving).toBe(96);
  });
  it("rejects bad input naming the item", () => {
    expect(() => stackCost({ items: [{ name: "X", price: 10, period: "week" }] })).toThrow(/X.*period/i);
    expect(() => stackCost({ items: [] })).toThrow(/at least one/i);
    expect(() => stackCost({ items: [{ name: "Y", price: 10, period: "month", seats: 1.5 }] })).toThrow(/Y.*seats/i);
    expect(() => stackCost({ items: [{ name: "Z", price: 10, period: "month", annualDiscountPercent: 120 }] })).toThrow(/Z.*discount/i);
    expect(() => stackCost({ items: [{ name: "W", price: -1, period: "month" }] })).toThrow(/W.*price/i);
  });
});
