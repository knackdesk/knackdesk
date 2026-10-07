import { describe, it, expect } from "vitest";
import { homeCareBillRate } from "../public/calc.js";
describe("homeCareBillRate", () => {
  it("turns pay, on-costs, non-billable time, overhead and margin into a bill rate per hour", () => {
    const r = homeCareBillRate({ caregiverPayRate: 16, onCostsPercent: 22, nonBillablePaidPercent: 10, overheadMonthly: 18000, billableHoursMonthly: 3200, marginPercent: 25 });
    expect(r.loadedPayRate).toBe(19.52); expect(r.labourCostPerBillableHour).toBe(21.47); expect(r.overheadPerBillableHour).toBe(5.63);
    expect(r.costPerBillableHour).toBe(27.1); expect(r.billRate).toBe(36.13); expect(r.marginPerHour).toBe(9.03);
  });
  it("assumes no on-costs, non-billable time, overhead or margin by default", () => {
    const r = homeCareBillRate({ caregiverPayRate: 15, billableHoursMonthly: 100 });
    expect(r.loadedPayRate).toBe(15); expect(r.labourCostPerBillableHour).toBe(15); expect(r.overheadPerBillableHour).toBe(0);
    expect(r.costPerBillableHour).toBe(15); expect(r.billRate).toBe(15); expect(r.marginPerHour).toBe(0);
  });
  it("gives the break-even bill rate when the margin is 0", () => {
    const r = homeCareBillRate({ caregiverPayRate: 20, onCostsPercent: 10, overheadMonthly: 1000, billableHoursMonthly: 500, marginPercent: 0 });
    expect(r.costPerBillableHour).toBe(24); expect(r.billRate).toBe(24); expect(r.marginPerHour).toBe(0);
  });
  it("rejects billable hours of 0", () => {
    expect(() => homeCareBillRate({ caregiverPayRate: 16, billableHoursMonthly: 0 })).toThrow(/more than 0/);
  });
  it("rejects a margin of 100 percent or more", () => {
    expect(() => homeCareBillRate({ caregiverPayRate: 16, billableHoursMonthly: 100, marginPercent: 100 })).toThrow(/less than 100/);
    expect(() => homeCareBillRate({ caregiverPayRate: 16, billableHoursMonthly: 100, marginPercent: 120 })).toThrow(/less than 100/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => homeCareBillRate({ caregiverPayRate: -1, billableHoursMonthly: 100 })).toThrow(/0 or more/);
    expect(() => homeCareBillRate({ caregiverPayRate: 16, onCostsPercent: NaN, billableHoursMonthly: 100 })).toThrow(/0 or more/);
    expect(() => homeCareBillRate({ caregiverPayRate: 16, overheadMonthly: -5, billableHoursMonthly: 100 })).toThrow(/0 or more/);
    expect(() => homeCareBillRate({})).toThrow(/0 or more/);
  });
});
