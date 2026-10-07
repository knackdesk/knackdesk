import { describe, it, expect } from "vitest";
import { placementFee } from "../public/calc.js";
describe("placementFee", () => {
  it("turns salary, fee, recruiter time, advertising and split into fee, delivery cost, margin and effective hourly rate", () => {
    const r = placementFee({ annualSalary: 80000, feePercent: 20, recruiterHours: 35, recruiterCostPerHour: 45, advertisingCosts: 300, splitPercent: 0 });
    expect(r.grossFee).toBe(16000); expect(r.splitFee).toBe(0); expect(r.netFee).toBe(16000); expect(r.deliveryCost).toBe(1875);
    expect(r.marginOnPlacement).toBe(14125); expect(r.marginPercent).toBe(88.28); expect(r.effectiveHourlyRate).toBe(457.14);
  });
  it("assumes no recruiter time, advertising or split by default and returns a null hourly rate", () => {
    const r = placementFee({ annualSalary: 50000, feePercent: 10 });
    expect(r.grossFee).toBe(5000); expect(r.splitFee).toBe(0); expect(r.netFee).toBe(5000); expect(r.deliveryCost).toBe(0);
    expect(r.marginOnPlacement).toBe(5000); expect(r.marginPercent).toBe(100); expect(r.effectiveHourlyRate).toBeNull();
  });
  it("takes the split partner's share out of the fee", () => {
    const r = placementFee({ annualSalary: 80000, feePercent: 20, recruiterHours: 20, recruiterCostPerHour: 40, splitPercent: 50 });
    expect(r.splitFee).toBe(8000); expect(r.netFee).toBe(8000); expect(r.deliveryCost).toBe(800);
    expect(r.marginOnPlacement).toBe(7200); expect(r.marginPercent).toBe(90); expect(r.effectiveHourlyRate).toBe(400);
  });
  it("returns a negative margin when delivery costs exceed the net fee", () => {
    const r = placementFee({ annualSalary: 10000, feePercent: 10, recruiterHours: 40, recruiterCostPerHour: 50 });
    expect(r.marginOnPlacement).toBe(-1000); expect(r.marginPercent).toBe(-100);
  });
  it("returns a margin of 0 when the net fee is 0", () => {
    const r = placementFee({ annualSalary: 80000, feePercent: 20, recruiterHours: 10, recruiterCostPerHour: 40, splitPercent: 100 });
    expect(r.netFee).toBe(0); expect(r.marginPercent).toBe(0); expect(r.effectiveHourlyRate).toBe(0);
  });
  it("rejects percentages above 100", () => {
    expect(() => placementFee({ annualSalary: 80000, feePercent: 101 })).toThrow(/100 or less/);
    expect(() => placementFee({ annualSalary: 80000, feePercent: 20, splitPercent: 101 })).toThrow(/100 or less/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => placementFee({ annualSalary: -1, feePercent: 20 })).toThrow(/0 or more/);
    expect(() => placementFee({ annualSalary: 80000, feePercent: NaN })).toThrow(/0 or more/);
    expect(() => placementFee({ feePercent: 20 })).toThrow(/0 or more/);
  });
});
