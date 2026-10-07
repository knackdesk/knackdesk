import { describe, it, expect } from "vitest";
import { carePlanQuote } from "../public/calc.js";
describe("carePlanQuote", () => {
  it("prices standard, weekend, overnight and mileage into a weekly and period quote", () => {
    const r = carePlanQuote({ hoursPerWeek: 30, billRate: 36, weekendHours: 8, weekendUpliftPercent: 15, overnightHours: 0, overnightRate: 0, milesPerWeek: 40, mileageRate: 0.5, weeks: 4 });
    expect(r.standardHours).toBe(22); expect(r.standardCost).toBe(792); expect(r.weekendCost).toBe(331.2); expect(r.overnightCost).toBe(0);
    expect(r.mileageCost).toBe(20); expect(r.weeklyTotal).toBe(1143.2); expect(r.periodTotal).toBe(4572.8); expect(r.effectiveHourlyRate).toBe(38.11);
  });
  it("assumes no weekend, overnight or mileage and 4 weeks by default", () => {
    const r = carePlanQuote({ hoursPerWeek: 10, billRate: 30 });
    expect(r.standardHours).toBe(10); expect(r.standardCost).toBe(300); expect(r.weekendCost).toBe(0); expect(r.overnightCost).toBe(0);
    expect(r.mileageCost).toBe(0); expect(r.weeklyTotal).toBe(300); expect(r.periodTotal).toBe(1200); expect(r.effectiveHourlyRate).toBe(30);
  });
  it("prices overnight hours at the overnight rate", () => {
    const r = carePlanQuote({ hoursPerWeek: 20, billRate: 30, overnightHours: 10, overnightRate: 20, weeks: 1 });
    expect(r.standardHours).toBe(10); expect(r.overnightCost).toBe(200); expect(r.weeklyTotal).toBe(500); expect(r.effectiveHourlyRate).toBe(25);
  });
  it("returns null for the effective hourly rate when there are no hours", () => {
    const r = carePlanQuote({ hoursPerWeek: 0, billRate: 30, milesPerWeek: 10, mileageRate: 0.5 });
    expect(r.weeklyTotal).toBe(5); expect(r.periodTotal).toBe(20); expect(r.effectiveHourlyRate).toBeNull();
  });
  it("rejects weekend plus overnight hours greater than the hours per week", () => {
    expect(() => carePlanQuote({ hoursPerWeek: 10, billRate: 30, weekendHours: 6, overnightHours: 5 })).toThrow("Weekend and overnight hours cannot exceed the hours per week.");
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => carePlanQuote({ hoursPerWeek: -1, billRate: 30 })).toThrow(/0 or more/);
    expect(() => carePlanQuote({ hoursPerWeek: 10, billRate: NaN })).toThrow(/0 or more/);
    expect(() => carePlanQuote({ hoursPerWeek: 10, billRate: 30, weeks: -1 })).toThrow(/0 or more/);
    expect(() => carePlanQuote({})).toThrow(/0 or more/);
  });
});
