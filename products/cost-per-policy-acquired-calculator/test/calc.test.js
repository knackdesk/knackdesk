import { describe, it, expect } from "vitest";
import { costPerPolicyAcquired } from "../public/calc.js";
describe("costPerPolicyAcquired", () => {
  it("turns marketing, lead costs, producer time, policies written, commission, retention and years into cost per policy, lifetime commission and payback", () => {
    const r = costPerPolicyAcquired({ marketingSpend: 6000, leadCosts: 2400, producerHours: 80, producerCostPerHour: 45, policiesWritten: 60, firstYearCommissionPerPolicy: 180, renewalCommissionPerPolicy: 120, retentionPercent: 88, yearsRetained: 3 });
    expect(r.totalAcquisitionCost).toBe(12000); expect(r.costPerPolicy).toBe(200); expect(r.lifetimeCommission).toBe(378.53);
    expect(r.valueToCostRatio).toBe(1.89); expect(r.paybackPolicies).toBe(66.67);
  });
  it("assumes no lead costs, producer time or commission, full retention and one year by default and returns a null payback", () => {
    const r = costPerPolicyAcquired({ marketingSpend: 1000, policiesWritten: 10 });
    expect(r.totalAcquisitionCost).toBe(1000); expect(r.costPerPolicy).toBe(100); expect(r.lifetimeCommission).toBe(0);
    expect(r.valueToCostRatio).toBe(0); expect(r.paybackPolicies).toBeNull();
  });
  it("uses only first-year commission when one year is retained", () => {
    const r = costPerPolicyAcquired({ marketingSpend: 1000, policiesWritten: 10, firstYearCommissionPerPolicy: 200, renewalCommissionPerPolicy: 150, retentionPercent: 90, yearsRetained: 1 });
    expect(r.lifetimeCommission).toBe(200); expect(r.valueToCostRatio).toBe(2); expect(r.paybackPolicies).toBe(5);
  });
  it("returns a null value-to-cost ratio when the total cost is 0", () => {
    const r = costPerPolicyAcquired({ marketingSpend: 0, policiesWritten: 5, firstYearCommissionPerPolicy: 100 });
    expect(r.costPerPolicy).toBe(0); expect(r.valueToCostRatio).toBeNull(); expect(r.paybackPolicies).toBe(0);
  });
  it("rejects policies written of 0", () => {
    expect(() => costPerPolicyAcquired({ marketingSpend: 1000, policiesWritten: 0 })).toThrow(/Policies written must be more than 0/);
  });
  it("rejects a retention percentage above 100", () => {
    expect(() => costPerPolicyAcquired({ marketingSpend: 1000, policiesWritten: 5, retentionPercent: 101 })).toThrow(/between 0 and 100/);
  });
  it("rejects years retained below 1 or not a whole number", () => {
    expect(() => costPerPolicyAcquired({ marketingSpend: 1000, policiesWritten: 5, yearsRetained: 0.5 })).toThrow(/Years retained must be a whole number of 1 or more/);
    expect(() => costPerPolicyAcquired({ marketingSpend: 1000, policiesWritten: 5, yearsRetained: 2.5 })).toThrow(/Years retained must be a whole number of 1 or more/);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => costPerPolicyAcquired({ marketingSpend: -1, policiesWritten: 5 })).toThrow(/0 or more/);
    expect(() => costPerPolicyAcquired({ marketingSpend: 1000, policiesWritten: 5, producerHours: NaN })).toThrow(/Producer hours/);
    expect(() => costPerPolicyAcquired({ policiesWritten: 5 })).toThrow(/Marketing spend/);
  });
});
