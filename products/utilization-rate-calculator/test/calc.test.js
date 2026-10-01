import { describe, it, expect } from "vitest";
import { utilization } from "../public/calc.js";
describe("utilization", () => {
  it("computes the rate, non-billable hours, revenue and hours to target", () => {
    const r = utilization({ billableHours: 120, availableHours: 160, hourlyRate: 100, targetPercent: 80 });
    expect(r.ratePercent).toBe(75); expect(r.nonBillableHours).toBe(40); expect(r.billableRevenue).toBe(12000);
    expect(r.hoursToTarget).toBe(8); expect(r.revenueAtTarget).toBe(12800);
  });
  it("reports zero hours to target when already above it", () => {
    expect(utilization({ billableHours: 140, availableHours: 160, hourlyRate: 0, targetPercent: 80 }).hoursToTarget).toBe(0);
  });
  it("rejects zero available hours", () => {
    expect(() => utilization({ billableHours: 10, availableHours: 0, hourlyRate: 0, targetPercent: 80 })).toThrow(/available/i);
  });
  it("rejects billable above available", () => {
    expect(() => utilization({ billableHours: 170, availableHours: 160, hourlyRate: 0, targetPercent: 80 })).toThrow(/billable/i);
  });
});
