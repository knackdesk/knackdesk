import { describe, it, expect } from "vitest";
import { caregiverUtilization } from "../public/calc.js";
describe("caregiverUtilization", () => {
  it("turns paid, billable, travel and training hours into utilization and the cost of non-billable time", () => {
    const r = caregiverUtilization({ paidHours: 160, billableHours: 136, travelHours: 14, trainingHours: 4, payRate: 16 });
    expect(r.utilizationPercent).toBe(85); expect(r.nonBillableHours).toBe(24); expect(r.otherNonBillableHours).toBe(6);
    expect(r.nonBillableCost).toBe(384); expect(r.travelSharePercent).toBe(8.75); expect(r.trainingSharePercent).toBe(2.5);
  });
  it("assumes no travel, training or pay rate by default", () => {
    const r = caregiverUtilization({ paidHours: 40, billableHours: 30 });
    expect(r.utilizationPercent).toBe(75); expect(r.nonBillableHours).toBe(10); expect(r.otherNonBillableHours).toBe(10);
    expect(r.nonBillableCost).toBe(0); expect(r.travelSharePercent).toBe(0); expect(r.trainingSharePercent).toBe(0);
  });
  it("gives 100 percent when every paid hour is billed", () => {
    const r = caregiverUtilization({ paidHours: 40, billableHours: 40, payRate: 16 });
    expect(r.utilizationPercent).toBe(100); expect(r.nonBillableHours).toBe(0); expect(r.nonBillableCost).toBe(0);
  });
  it("rejects paid hours of 0", () => {
    expect(() => caregiverUtilization({ paidHours: 0, billableHours: 0 })).toThrow(/more than 0/);
  });
  it("rejects billable hours greater than paid hours", () => {
    expect(() => caregiverUtilization({ paidHours: 40, billableHours: 41 })).toThrow(/cannot exceed the paid hours/);
  });
  it("rejects travel plus training greater than the non-billable hours", () => {
    expect(() => caregiverUtilization({ paidHours: 40, billableHours: 35, travelHours: 4, trainingHours: 2 })).toThrow("Travel and training hours cannot exceed the non-billable hours.");
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => caregiverUtilization({ paidHours: -1, billableHours: 0 })).toThrow(/0 or more/);
    expect(() => caregiverUtilization({ paidHours: 40, billableHours: NaN })).toThrow(/0 or more/);
    expect(() => caregiverUtilization({ paidHours: 40, billableHours: 30, payRate: -2 })).toThrow(/0 or more/);
    expect(() => caregiverUtilization({})).toThrow(/0 or more/);
  });
});
