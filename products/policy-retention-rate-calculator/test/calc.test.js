import { describe, it, expect } from "vitest";
import { policyRetentionRate } from "../public/calc.js";
describe("policyRetentionRate", () => {
  it("turns policies at start, policies lost, new policies and average commission into retention, lapse, growth and commission figures", () => {
    const r = policyRetentionRate({ policiesAtStart: 400, policiesLost: 48, newPolicies: 60, averageAnnualCommission: 120 });
    expect(r.retentionPercent).toBe(88); expect(r.lapsePercent).toBe(12); expect(r.policiesAtEnd).toBe(412);
    expect(r.netGrowthPercent).toBe(3); expect(r.commissionLost).toBe(5760); expect(r.commissionRetained).toBe(42240);
  });
  it("assumes no new policies and no commission by default", () => {
    const r = policyRetentionRate({ policiesAtStart: 200, policiesLost: 20 });
    expect(r.retentionPercent).toBe(90); expect(r.lapsePercent).toBe(10); expect(r.policiesAtEnd).toBe(180);
    expect(r.netGrowthPercent).toBe(-10); expect(r.commissionLost).toBe(0); expect(r.commissionRetained).toBe(0);
  });
  it("gives 100 percent retention when no policies are lost", () => {
    const r = policyRetentionRate({ policiesAtStart: 50, policiesLost: 0, newPolicies: 5, averageAnnualCommission: 100 });
    expect(r.retentionPercent).toBe(100); expect(r.lapsePercent).toBe(0); expect(r.netGrowthPercent).toBe(10); expect(r.commissionLost).toBe(0);
  });
  it("gives 0 percent retention when every policy is lost", () => {
    const r = policyRetentionRate({ policiesAtStart: 30, policiesLost: 30 });
    expect(r.retentionPercent).toBe(0); expect(r.lapsePercent).toBe(100); expect(r.policiesAtEnd).toBe(0); expect(r.netGrowthPercent).toBe(-100);
  });
  it("rounds to two decimal places", () => {
    const r = policyRetentionRate({ policiesAtStart: 3, policiesLost: 1 });
    expect(r.retentionPercent).toBe(66.67); expect(r.lapsePercent).toBe(33.33);
  });
  it("rejects policies at start of 0", () => {
    expect(() => policyRetentionRate({ policiesAtStart: 0, policiesLost: 0 })).toThrow(/Policies at start must be more than 0/);
  });
  it("rejects policies lost greater than policies at start", () => {
    expect(() => policyRetentionRate({ policiesAtStart: 10, policiesLost: 11 })).toThrow(/cannot be more than policies at start/);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => policyRetentionRate({ policiesAtStart: -1, policiesLost: 0 })).toThrow(/0 or more/);
    expect(() => policyRetentionRate({ policiesAtStart: 10, policiesLost: 1, newPolicies: NaN })).toThrow(/New policies/);
    expect(() => policyRetentionRate({ policiesAtStart: 10, policiesLost: 1, averageAnnualCommission: "5" })).toThrow(/Average annual commission/);
    expect(() => policyRetentionRate({ policiesAtStart: 10 })).toThrow(/Policies lost/);
  });
});
