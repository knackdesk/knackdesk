import { describe, it, expect } from "vitest";
import { proratedRent, localIsoDate } from "../public/calc.js";

describe("prorated rent", () => {
  it("charges a move-in month by actual days, counting the move-in day", () => {
    expect(proratedRent({ monthlyRent: 1500, date: "2026-10-11", mode: "move-in", basis: "actual" })).toEqual({
      daysInMonth: 31, daysCharged: 21, dailyRate: 48.39, prorated: 1016.13, capped: false,
    });
  });
  it("uses a 30-day month when basis is 30", () => {
    const r = proratedRent({ monthlyRent: 1500, date: "2026-10-11", mode: "move-in", basis: "30" });
    expect(r.dailyRate).toBe(50);
    expect(r.prorated).toBe(1050);
    expect(r.daysInMonth).toBe(30);
  });
  it("charges a move-out month up to and including the move-out day", () => {
    expect(proratedRent({ monthlyRent: 1500, date: "2026-02-10", mode: "move-out", basis: "actual" })).toEqual({
      daysInMonth: 28, daysCharged: 10, dailyRate: 53.57, prorated: 535.71, capped: false,
    });
  });
  it("still charges one day for a move-in on the 31st with a 30-day basis", () => {
    const r = proratedRent({ monthlyRent: 1500, date: "2026-10-31", mode: "move-in", basis: "30" });
    expect(r.daysCharged).toBe(1);
    expect(r.prorated).toBe(50);
  });
  it("never charges more than the monthly rent on a 30-day basis", () => {
    const r = proratedRent({ monthlyRent: 1500, date: "2026-10-01", mode: "move-in", basis: "30" });
    expect(r.prorated).toBe(1500);
    expect(r.capped).toBe(true);
    expect(r.daysCharged).toBe(31);
    expect(proratedRent({ monthlyRent: 1500, date: "2026-10-31", mode: "move-out", basis: "30" }).prorated).toBe(1500);
    expect(proratedRent({ monthlyRent: 1500, date: "2026-10-11", mode: "move-in", basis: "30" }).capped).toBe(false);
  });
  it("rejects invalid dates", () => {
    expect(() => proratedRent({ monthlyRent: 1500, date: "2026-02-30", mode: "move-in", basis: "actual" })).toThrow(/date/i);
    expect(() => proratedRent({ monthlyRent: 1500, date: "11/10/2026", mode: "move-in", basis: "actual" })).toThrow(/date/i);
  });
  it("rejects a bad mode, a bad basis and negative rent", () => {
    expect(() => proratedRent({ monthlyRent: 1500, date: "2026-10-11", mode: "sideways", basis: "actual" })).toThrow(/mode/i);
    expect(() => proratedRent({ monthlyRent: 1500, date: "2026-10-11", mode: "move-in", basis: "31" })).toThrow(/basis/i);
    expect(() => proratedRent({ monthlyRent: -1, date: "2026-10-11", mode: "move-in", basis: "actual" })).toThrow(/rent/i);
  });
  it("formats a local date as YYYY-MM-DD", () => {
    expect(localIsoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
