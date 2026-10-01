import { describe, it, expect } from "vitest";
import { podProfit } from "../public/calc.js";
const base = { salePrice: 30, baseCost: 14, shippingCharged: 4, shippingCost: 5, platformFeePercent: 5, paymentPercent: 2.9, paymentFixed: 0.3, targetProfit: 500 };
describe("podProfit", () => {
  it("computes profit and margin after base cost, shipping and fees", () => {
    const r = podProfit(base);
    expect(r.revenue).toBe(34); expect(r.platformFee).toBe(1.7); expect(r.paymentFee).toBe(1.29); expect(r.totalCosts).toBe(21.99);
    expect(r.profit).toBe(12.01); expect(r.margin).toBe(35.32); expect(r.salesForTarget).toBe(42);
  });
  it("reports null sales for target when there is no profit", () => {
    const r = podProfit({ ...base, salePrice: 15 });
    expect(r.profit).toBeLessThan(0); expect(r.salesForTarget).toBeNull();
  });
  it("rejects a zero sale price", () => {
    expect(() => podProfit({ ...base, salePrice: 0 })).toThrow(/price/i);
  });
});
