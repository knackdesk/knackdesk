import { describe, it, expect } from "vitest";
import { orderProfit } from "../public/calc.js";

describe("profit per order", () => {
  it("subtracts cost, packaging, shipping paid and fees, adds shipping charged", () => {
    const r = orderProfit({ price: 40, cost: 15, packaging: 1, shippingCharged: 5, shippingPaid: 6, platformFeePercent: 10, paymentFeePercent: 3, paymentFeeFixed: 0.3 });
    expect(r.fees).toBe(6.15);
    expect(r.profit).toBe(16.85);
    expect(r.revenue).toBe(45);
    expect(r.marginPercent).toBe(37.44);
  });
  it("reports a loss as negative profit", () => {
    expect(orderProfit({ price: 10, cost: 12, packaging: 0, shippingCharged: 0, shippingPaid: 0, platformFeePercent: 0, paymentFeePercent: 0, paymentFeeFixed: 0 }).profit).toBe(-2);
  });
  it("rejects negative inputs and fee percents over 100", () => {
    expect(() => orderProfit({ price: -1, cost: 0, packaging: 0, shippingCharged: 0, shippingPaid: 0, platformFeePercent: 0, paymentFeePercent: 0, paymentFeeFixed: 0 })).toThrow(/price/i);
    expect(() => orderProfit({ price: 10, cost: 0, packaging: 0, shippingCharged: 0, shippingPaid: 0, platformFeePercent: 101, paymentFeePercent: 0, paymentFeeFixed: 0 })).toThrow(/fee/i);
  });
});
