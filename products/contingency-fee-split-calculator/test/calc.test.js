import { describe, it, expect } from "vitest";
import { contingencyFeeSplit } from "../public/calc.js";
describe("contingencyFeeSplit", () => {
  it("turns a settlement, percentage, costs, referral share and hours into the fee split with costs taken after the fee", () => {
    const r = contingencyFeeSplit({ settlementAmount: 120000, contingencyPercent: 33.33, caseCosts: 8000, costsDeductedBeforeFee: false, referralFeePercent: 25, hoursWorked: 180 });
    expect(r.feeBase).toBe(120000); expect(r.grossFee).toBe(39996); expect(r.referralFee).toBe(9999);
    expect(r.netFeeToFirm).toBe(29997); expect(r.netToClient).toBe(72004); expect(r.effectiveHourlyRate).toBe(166.65);
  });
  it("takes the fee from the settlement net of costs when costs are deducted before the fee", () => {
    const r = contingencyFeeSplit({ settlementAmount: 120000, contingencyPercent: 33.33, caseCosts: 8000, costsDeductedBeforeFee: true, referralFeePercent: 25, hoursWorked: 180 });
    expect(r.feeBase).toBe(112000); expect(r.grossFee).toBe(37329.6); expect(r.netToClient).toBe(74670.4);
    expect(r.referralFee).toBe(9332.4); expect(r.netFeeToFirm).toBe(27997.2); expect(r.effectiveHourlyRate).toBe(155.54);
  });
  it("assumes no costs, no referral and no hours by default and returns a null hourly rate", () => {
    const r = contingencyFeeSplit({ settlementAmount: 100000, contingencyPercent: 30 });
    expect(r.feeBase).toBe(100000); expect(r.grossFee).toBe(30000); expect(r.referralFee).toBe(0);
    expect(r.netFeeToFirm).toBe(30000); expect(r.netToClient).toBe(70000); expect(r.effectiveHourlyRate).toBeNull();
  });
  it("rejects a contingency percentage above 100 and costs greater than the settlement", () => {
    expect(() => contingencyFeeSplit({ settlementAmount: 100000, contingencyPercent: 101 })).toThrow(/Contingency percentage must be 100 or less/);
    expect(() => contingencyFeeSplit({ settlementAmount: 100000, contingencyPercent: 30, caseCosts: 100001 })).toThrow(/Case costs cannot be more than the settlement/);
  });
  it("rejects a referral percentage above 100 and a non-boolean costs choice", () => {
    expect(() => contingencyFeeSplit({ settlementAmount: 100000, contingencyPercent: 30, referralFeePercent: 120 })).toThrow(/Referral fee percentage must be 100 or less/);
    expect(() => contingencyFeeSplit({ settlementAmount: 100000, contingencyPercent: 30, costsDeductedBeforeFee: "yes" })).toThrow(/true or false/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => contingencyFeeSplit({ settlementAmount: -1, contingencyPercent: 30 })).toThrow(/0 or more/);
    expect(() => contingencyFeeSplit({ settlementAmount: 100000, contingencyPercent: NaN })).toThrow(/0 or more/);
    expect(() => contingencyFeeSplit({ contingencyPercent: 30 })).toThrow(/0 or more/);
    expect(() => contingencyFeeSplit({ settlementAmount: 100000, contingencyPercent: 30, hoursWorked: -2 })).toThrow(/0 or more/);
  });
});
