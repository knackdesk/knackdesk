import { describe, it, expect } from "vitest";
import { fromAnnual, fromHourly } from "../public/calc.js";

describe("salary to hourly", () => {
  it("converts annual to monthly, weekly, daily and hourly with real hours", () => {
    const r = fromAnnual({ annual: 52000, hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 });
    expect(r.monthly).toBe(4333.33);
    expect(r.weekly).toBe(1000);
    expect(r.daily).toBe(200);
    expect(r.hourly).toBe(25);
  });
  it("converts hourly to annual", () => {
    expect(fromHourly({ hourly: 30, hoursPerWeek: 35, weeksPerYear: 48 }).annual).toBe(50400);
  });
  it("rejects zero hours or weeks", () => {
    expect(() => fromAnnual({ annual: 1000, hoursPerWeek: 0, weeksPerYear: 52, daysPerWeek: 5 })).toThrow(/hours/i);
  });
});
