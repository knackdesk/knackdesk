import { describe, it, expect } from "vitest";
import { applyDiscount, discountBetween, stackDiscounts } from "../public/calc.js";

describe("discount", () => {
  it("applies a percentage discount", () => {
    expect(applyDiscount({ price: 250, percent: 20 })).toEqual({ finalPrice: 200, saved: 50 });
  });
  it("finds the discount between two prices", () => {
    expect(discountBetween({ original: 250, sale: 200 })).toBe(20);
  });
  it("stacks discounts multiplicatively, not additively", () => {
    const r = stackDiscounts({ price: 100, percents: [20, 10] });
    expect(r.finalPrice).toBe(72);
    expect(r.combinedPercent).toBe(28);
  });
  it("rejects discounts over 100 and sale above original", () => {
    expect(() => applyDiscount({ price: 10, percent: 101 })).toThrow(/discount/i);
    expect(() => discountBetween({ original: 10, sale: 11 })).toThrow(/sale/i);
  });
});
