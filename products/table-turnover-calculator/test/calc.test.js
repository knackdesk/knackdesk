import { describe, it, expect } from "vitest";
import { tableTurnover } from "../public/calc.js";
describe("tableTurnover", () => {
  it("turns seats, opening hours, dining time and occupancy into turns, covers and revenue", () => {
    const r = tableTurnover({ seats: 80, hoursOpen: 6, averageDiningMinutes: 90, occupancyPercent: 70, averageCheck: 28 });
    expect(r.turnsPerSeat).toBe(4); expect(r.coversPerDay).toBe(224); expect(r.revenuePerDay).toBe(6272);
  });
  it("assumes full occupancy and no check by default", () => {
    const r = tableTurnover({ seats: 10, hoursOpen: 3, averageDiningMinutes: 60 });
    expect(r.coversPerDay).toBe(30); expect(r.revenuePerDay).toBe(0);
  });
  it("rejects zero dining minutes", () => {
    expect(() => tableTurnover({ seats: 80, hoursOpen: 6, averageDiningMinutes: 0 })).toThrow(/minutes/i);
  });
  it("rejects occupancy above 100", () => {
    expect(() => tableTurnover({ seats: 80, hoursOpen: 6, averageDiningMinutes: 90, occupancyPercent: 101 })).toThrow(/occupancy/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => tableTurnover({ seats: -1, hoursOpen: 6, averageDiningMinutes: 90 })).toThrow(/0 or more/);
    expect(() => tableTurnover({ seats: 80, hoursOpen: NaN, averageDiningMinutes: 90 })).toThrow(/0 or more/);
  });
});
