import { describe, it, expect } from "vitest";
import { practiceOverheadPercentage } from "../public/calc.js";
describe("practiceOverheadPercentage", () => {
  it("turns collections and costs into overhead, overhead percentage and profit before and after owner pay", () => {
    const r = practiceOverheadPercentage({ collections: 60000, staffCosts: 18000, rentAndFacilities: 6000, suppliesAndLab: 7000, marketing: 1500, otherOverhead: 4500, ownerCompensation: 12000 });
    expect(r.totalOverhead).toBe(37000); expect(r.overheadPercent).toBe(61.67); expect(r.profitBeforeOwner).toBe(23000);
    expect(r.profitAfterOwner).toBe(11000); expect(r.profitMarginPercent).toBe(38.33);
  });
  it("assumes no costs and no owner pay by default", () => {
    const r = practiceOverheadPercentage({ collections: 10000 });
    expect(r.totalOverhead).toBe(0); expect(r.overheadPercent).toBe(0); expect(r.profitBeforeOwner).toBe(10000);
    expect(r.profitAfterOwner).toBe(10000); expect(r.profitMarginPercent).toBe(100);
  });
  it("does not count owner compensation as overhead", () => {
    const r = practiceOverheadPercentage({ collections: 10000, staffCosts: 2000, ownerCompensation: 5000 });
    expect(r.totalOverhead).toBe(2000); expect(r.overheadPercent).toBe(20); expect(r.profitAfterOwner).toBe(3000);
  });
  it("returns a negative profit after owner pay when owner pay exceeds what is left", () => {
    const r = practiceOverheadPercentage({ collections: 60000, staffCosts: 18000, rentAndFacilities: 6000, suppliesAndLab: 7000, marketing: 1500, otherOverhead: 4500, ownerCompensation: 30000 });
    expect(r.profitBeforeOwner).toBe(23000); expect(r.profitAfterOwner).toBe(-7000);
  });
  it("returns percentages of 0 when collections are 0", () => {
    const r = practiceOverheadPercentage({ collections: 0, staffCosts: 1000 });
    expect(r.overheadPercent).toBe(0); expect(r.profitMarginPercent).toBe(0); expect(r.profitBeforeOwner).toBe(-1000);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => practiceOverheadPercentage({ collections: -1 })).toThrow(/0 or more/);
    expect(() => practiceOverheadPercentage({ collections: 1000, staffCosts: NaN })).toThrow(/Staff costs/);
    expect(() => practiceOverheadPercentage({})).toThrow(/Collections/);
  });
});
