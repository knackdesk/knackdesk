import { describe, it, expect } from "vitest";
import { earlyPayment } from "../public/calc.js";

describe("early payment discount", () => {
  it("2/10 net 30 on 10000: saves 200 and implies ~36.7% annual rate", () => {
    const r = earlyPayment({ amount: 10000, discountPercent: 2, discountDays: 10, netDays: 30 });
    expect(r.saving).toBe(200);
    expect(r.payEarly).toBe(9800);
    expect(r.daysGained).toBe(20);
    expect(r.annualRate).toBe(37.24);
  });
  it("1/15 net 45 on 5000", () => {
    const r = earlyPayment({ amount: 5000, discountPercent: 1, discountDays: 15, netDays: 45 });
    expect(r.saving).toBe(50);
    expect(r.annualRate).toBe(12.29);
  });
  it("rejects net days not after discount days and bad percents", () => {
    expect(() => earlyPayment({ amount: 100, discountPercent: 2, discountDays: 30, netDays: 30 })).toThrow(/net/i);
    expect(() => earlyPayment({ amount: 100, discountPercent: 100, discountDays: 10, netDays: 30 })).toThrow(/discount/i);
  });
});
