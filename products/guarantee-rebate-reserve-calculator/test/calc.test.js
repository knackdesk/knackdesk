import { describe, it, expect } from "vitest";
import { guaranteeRebateReserve } from "../public/calc.js";
describe("guaranteeRebateReserve", () => {
  it("turns fee, fall-off, rebate and placements into the expected rebate, net fee and annual reserve", () => {
    const r = guaranteeRebateReserve({ placementFee: 16000, guaranteeDays: 90, expectedFallOffPercent: 8, rebatePercent: 100, placementsPerYear: 20 });
    expect(r.expectedRebatePerPlacement).toBe(1280); expect(r.netExpectedFee).toBe(14720); expect(r.reservePercentOfFee).toBe(8);
    expect(r.annualReserve).toBe(25600); expect(r.annualNetFees).toBe(294400); expect(r.guaranteeDays).toBe(90);
  });
  it("halves the expected rebate when only half the fee is refunded", () => {
    const r = guaranteeRebateReserve({ placementFee: 16000, guaranteeDays: 90, expectedFallOffPercent: 8, rebatePercent: 50, placementsPerYear: 20 });
    expect(r.expectedRebatePerPlacement).toBe(640); expect(r.netExpectedFee).toBe(15360); expect(r.reservePercentOfFee).toBe(4); expect(r.annualReserve).toBe(12800);
  });
  it("assumes a 90-day guarantee, a full rebate and one placement by default", () => {
    const r = guaranteeRebateReserve({ placementFee: 10000, expectedFallOffPercent: 10 });
    expect(r.guaranteeDays).toBe(90); expect(r.expectedRebatePerPlacement).toBe(1000); expect(r.netExpectedFee).toBe(9000);
    expect(r.annualReserve).toBe(1000); expect(r.annualNetFees).toBe(9000);
  });
  it("returns no reserve when the expected fall-off is 0", () => {
    const r = guaranteeRebateReserve({ placementFee: 10000, expectedFallOffPercent: 0, placementsPerYear: 5 });
    expect(r.expectedRebatePerPlacement).toBe(0); expect(r.reservePercentOfFee).toBe(0); expect(r.annualNetFees).toBe(50000);
  });
  it("rejects percentages above 100", () => {
    expect(() => guaranteeRebateReserve({ placementFee: 10000, expectedFallOffPercent: 101 })).toThrow(/100 or less/);
    expect(() => guaranteeRebateReserve({ placementFee: 10000, expectedFallOffPercent: 10, rebatePercent: 101 })).toThrow(/100 or less/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => guaranteeRebateReserve({ placementFee: -1, expectedFallOffPercent: 10 })).toThrow(/0 or more/);
    expect(() => guaranteeRebateReserve({ placementFee: 10000, expectedFallOffPercent: 10, guaranteeDays: NaN })).toThrow(/0 or more/);
    expect(() => guaranteeRebateReserve({ placementFee: 10000 })).toThrow(/0 or more/);
  });
});
