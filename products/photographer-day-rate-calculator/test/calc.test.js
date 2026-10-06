import { describe, it, expect } from "vitest";
import { dayRate } from "../public/calc.js";
describe("dayRate", () => {
  it("turns an income goal and business costs into a day rate, hourly figure and half-day rate", () => {
    const r = dayRate({ incomeGoal: 60000, businessCosts: 12000, shootDaysPerYear: 80, hoursPerShootDay: 8, editingHoursPerShootDay: 6 });
    expect(r.revenueNeeded).toBe(72000); expect(r.dayRate).toBe(900); expect(r.hoursPerBooking).toBe(14);
    expect(r.effectiveHourly).toBe(64.29); expect(r.halfDayRate).toBe(540);
  });
  it("uses an 8 hour day and no costs or editing by default", () => {
    const r = dayRate({ incomeGoal: 40000, shootDaysPerYear: 100 });
    expect(r.dayRate).toBe(400); expect(r.hoursPerBooking).toBe(8); expect(r.effectiveHourly).toBe(50);
  });
  it("rejects zero shoot days", () => {
    expect(() => dayRate({ incomeGoal: 60000, shootDaysPerYear: 0 })).toThrow(/days/i);
  });
  it("rejects zero hours per booking", () => {
    expect(() => dayRate({ incomeGoal: 60000, shootDaysPerYear: 80, hoursPerShootDay: 0, editingHoursPerShootDay: 0 })).toThrow(/hours/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => dayRate({ incomeGoal: -1, shootDaysPerYear: 80 })).toThrow(/0 or more/);
    expect(() => dayRate({ incomeGoal: NaN, shootDaysPerYear: 80 })).toThrow(/0 or more/);
  });
});
