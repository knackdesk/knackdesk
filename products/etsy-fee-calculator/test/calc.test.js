import { describe, it, expect } from "vitest";
import { etsyFees } from "../public/calc.js";
const base = { salePrice: 25, shippingCharged: 5, listingFee: 0.2, transactionPercent: 6.5, paymentPercent: 3, paymentFixed: 0.25, offsiteAdsPercent: 0, itemCost: 8, shippingCost: 4 };
describe("etsyFees", () => {
  it("applies percentage fees to price plus shipping and adds fixed fees", () => {
    const r = etsyFees(base);
    expect(r.revenue).toBe(30); expect(r.transactionFee).toBe(1.95); expect(r.paymentFee).toBe(1.15); expect(r.listingFee).toBe(0.2);
    expect(r.offsiteFee).toBe(0); expect(r.totalFees).toBe(3.3); expect(r.feePercent).toBe(11); expect(r.profit).toBe(14.7); expect(r.margin).toBe(49);
  });
  it("adds the offsite ads fee when set", () => {
    const r = etsyFees({ ...base, offsiteAdsPercent: 15 });
    expect(r.offsiteFee).toBe(4.5); expect(r.totalFees).toBe(7.8); expect(r.profit).toBe(10.2);
  });
  it("rejects a zero sale price", () => {
    expect(() => etsyFees({ ...base, salePrice: 0 })).toThrow(/price/i);
  });
});
