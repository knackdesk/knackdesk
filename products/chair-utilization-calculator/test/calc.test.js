import { describe, it, expect } from "vitest";
import { chairUtilization } from "../public/calc.js";
describe("chairUtilization", () => {
  it("turns chairs, opening hours, days and scheduled hours into utilization, idle hours and production figures", () => {
    const r = chairUtilization({ chairs: 4, hoursOpenPerDay: 8, daysPerMonth: 20, scheduledHours: 448, productionPerScheduledHour: 180 });
    expect(r.availableChairHours).toBe(640); expect(r.utilizationPercent).toBe(70); expect(r.idleHours).toBe(192);
    expect(r.currentProduction).toBe(80640); expect(r.productionAtFull).toBe(115200); expect(r.unrealisedProduction).toBe(34560);
  });
  it("assumes no production rate by default and returns production figures of 0", () => {
    const r = chairUtilization({ chairs: 2, hoursOpenPerDay: 8, daysPerMonth: 10, scheduledHours: 80 });
    expect(r.availableChairHours).toBe(160); expect(r.utilizationPercent).toBe(50); expect(r.idleHours).toBe(80);
    expect(r.currentProduction).toBe(0); expect(r.productionAtFull).toBe(0); expect(r.unrealisedProduction).toBe(0);
  });
  it("accepts scheduled hours equal to available chair hours", () => {
    const r = chairUtilization({ chairs: 1, hoursOpenPerDay: 8, daysPerMonth: 1, scheduledHours: 8, productionPerScheduledHour: 100 });
    expect(r.utilizationPercent).toBe(100); expect(r.idleHours).toBe(0); expect(r.unrealisedProduction).toBe(0);
  });
  it("rounds to two decimals", () => {
    expect(chairUtilization({ chairs: 3, hoursOpenPerDay: 1, daysPerMonth: 1, scheduledHours: 1 }).utilizationPercent).toBe(33.33);
  });
  it("rejects chairs of 0", () => {
    expect(() => chairUtilization({ chairs: 0, hoursOpenPerDay: 8, daysPerMonth: 20, scheduledHours: 0 })).toThrow(/Chairs must be more than 0/);
  });
  it("rejects available chair hours of 0", () => {
    expect(() => chairUtilization({ chairs: 2, hoursOpenPerDay: 0, daysPerMonth: 20, scheduledHours: 0 })).toThrow(/Available chair hours must be more than 0/);
    expect(() => chairUtilization({ chairs: 2, hoursOpenPerDay: 8, daysPerMonth: 0, scheduledHours: 0 })).toThrow(/Available chair hours must be more than 0/);
  });
  it("rejects scheduled hours greater than available chair hours", () => {
    expect(() => chairUtilization({ chairs: 4, hoursOpenPerDay: 8, daysPerMonth: 20, scheduledHours: 641 })).toThrow("Scheduled hours cannot exceed available chair hours.");
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => chairUtilization({ chairs: -1, hoursOpenPerDay: 8, daysPerMonth: 20, scheduledHours: 10 })).toThrow(/0 or more/);
    expect(() => chairUtilization({ chairs: 2, hoursOpenPerDay: 8, daysPerMonth: 20, scheduledHours: 10, productionPerScheduledHour: NaN })).toThrow(/Production per scheduled hour/);
    expect(() => chairUtilization({ chairs: 2, hoursOpenPerDay: 8, daysPerMonth: 20 })).toThrow(/Scheduled hours/);
  });
});
