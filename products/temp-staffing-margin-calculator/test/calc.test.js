import { describe, it, expect } from "vitest";
import { tempStaffingMargin } from "../public/calc.js";
describe("tempStaffingMargin", () => {
  it("derives the bill rate from the markup and turns pay, on-costs and hours into margin per hour, week and assignment", () => {
    const r = tempStaffingMargin({ payRate: 20, onCostsPercent: 18, markupPercent: 55, billRate: 0, hoursPerWeek: 40, weeks: 12 });
    expect(r.billRateUsed).toBe(31); expect(r.loadedCostPerHour).toBe(23.6); expect(r.grossMarginPerHour).toBe(7.4); expect(r.grossMarginPercent).toBe(23.87);
    expect(r.billPerWeek).toBe(1240); expect(r.marginPerWeek).toBe(296); expect(r.marginForAssignment).toBe(3552);
  });
  it("uses a bill rate when one is given instead of the markup", () => {
    const r = tempStaffingMargin({ payRate: 20, onCostsPercent: 18, markupPercent: 55, billRate: 30, hoursPerWeek: 40, weeks: 12 });
    expect(r.billRateUsed).toBe(30); expect(r.grossMarginPerHour).toBe(6.4); expect(r.marginPerWeek).toBe(256); expect(r.marginForAssignment).toBe(3072);
  });
  it("assumes no on-costs or markup, 40 hours and 1 week by default", () => {
    const r = tempStaffingMargin({ payRate: 25 });
    expect(r.billRateUsed).toBe(25); expect(r.loadedCostPerHour).toBe(25); expect(r.grossMarginPerHour).toBe(0); expect(r.grossMarginPercent).toBe(0);
    expect(r.billPerWeek).toBe(1000); expect(r.marginPerWeek).toBe(0); expect(r.marginForAssignment).toBe(0);
  });
  it("returns a negative margin when the loaded cost is above the bill rate", () => {
    const r = tempStaffingMargin({ payRate: 20, onCostsPercent: 25, billRate: 24, hoursPerWeek: 10, weeks: 2 });
    expect(r.grossMarginPerHour).toBe(-1); expect(r.marginPerWeek).toBe(-10); expect(r.marginForAssignment).toBe(-20);
  });
  it("rejects a pay rate of 0", () => {
    expect(() => tempStaffingMargin({ payRate: 0, markupPercent: 50 })).toThrow(/more than 0/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => tempStaffingMargin({ payRate: -5 })).toThrow(/0 or more/);
    expect(() => tempStaffingMargin({ payRate: 20, onCostsPercent: NaN })).toThrow(/0 or more/);
    expect(() => tempStaffingMargin({ payRate: 20, weeks: -1 })).toThrow(/0 or more/);
    expect(() => tempStaffingMargin({})).toThrow(/0 or more/);
  });
});
