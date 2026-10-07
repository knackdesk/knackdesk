import { describe, it, expect } from "vitest";
import { clientHoursCapacity } from "../public/calc.js";
describe("clientHoursCapacity", () => {
  it("turns caregivers, hours and utilization into client capacity, spare hours and weekly revenue", () => {
    const r = clientHoursCapacity({ caregivers: 12, hoursPerCaregiverWeekly: 32, utilizationPercent: 85, averageClientHoursWeekly: 20, currentClients: 14, billRate: 36 });
    expect(r.paidCapacity).toBe(384); expect(r.billableCapacity).toBe(326.4); expect(r.maxClients).toBe(16); expect(r.hoursCommitted).toBe(280);
    expect(r.spareHours).toBe(46.4); expect(r.openSlots).toBe(2); expect(r.weeklyRevenueCeiling).toBe(11750.4); expect(r.currentWeeklyRevenue).toBe(10080);
  });
  it("assumes 100 percent utilization, no current clients and no bill rate by default", () => {
    const r = clientHoursCapacity({ caregivers: 2, hoursPerCaregiverWeekly: 30, averageClientHoursWeekly: 15 });
    expect(r.paidCapacity).toBe(60); expect(r.billableCapacity).toBe(60); expect(r.maxClients).toBe(4); expect(r.hoursCommitted).toBe(0);
    expect(r.spareHours).toBe(60); expect(r.openSlots).toBe(4); expect(r.weeklyRevenueCeiling).toBe(0); expect(r.currentWeeklyRevenue).toBe(0);
  });
  it("counts an exact fit as a whole client despite floating point error", () => {
    const r = clientHoursCapacity({ caregivers: 3, hoursPerCaregiverWeekly: 1, utilizationPercent: 10, averageClientHoursWeekly: 0.1 });
    expect(r.billableCapacity).toBe(0.3); expect(r.maxClients).toBe(3);
  });
  it("returns negative spare hours and open slots when overcommitted", () => {
    const r = clientHoursCapacity({ caregivers: 2, hoursPerCaregiverWeekly: 30, utilizationPercent: 100, averageClientHoursWeekly: 20, currentClients: 4 });
    expect(r.maxClients).toBe(3); expect(r.spareHours).toBe(-20); expect(r.openSlots).toBe(-1);
  });
  it("rejects 0 caregivers and 0 average client hours", () => {
    expect(() => clientHoursCapacity({ caregivers: 0, hoursPerCaregiverWeekly: 30, averageClientHoursWeekly: 20 })).toThrow(/more than 0/);
    expect(() => clientHoursCapacity({ caregivers: 2, hoursPerCaregiverWeekly: 30, averageClientHoursWeekly: 0 })).toThrow(/more than 0/);
  });
  it("rejects utilization above 100 percent", () => {
    expect(() => clientHoursCapacity({ caregivers: 2, hoursPerCaregiverWeekly: 30, utilizationPercent: 101, averageClientHoursWeekly: 20 })).toThrow(/100 or less/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => clientHoursCapacity({ caregivers: 2, hoursPerCaregiverWeekly: -1, averageClientHoursWeekly: 20 })).toThrow(/0 or more/);
    expect(() => clientHoursCapacity({ caregivers: 2, hoursPerCaregiverWeekly: 30, averageClientHoursWeekly: 20, billRate: NaN })).toThrow(/0 or more/);
    expect(() => clientHoursCapacity({})).toThrow(/0 or more/);
  });
});
