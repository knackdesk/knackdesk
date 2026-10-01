import { describe, it, expect } from "vitest";
import { workingDaysBetween, addWorkingDays, localIsoDate } from "../public/calc.js";

describe("working days between", () => {
  it("counts a Monday to Friday week", () => {
    expect(workingDaysBetween({ start: "2026-10-05", end: "2026-10-09" })).toEqual({ workingDays: 5, calendarDays: 5, weekendDays: 0, holidayDays: 0 });
  });
  it("skips a weekend", () => {
    expect(workingDaysBetween({ start: "2026-10-05", end: "2026-10-12" })).toEqual({ workingDays: 6, calendarDays: 8, weekendDays: 2, holidayDays: 0 });
  });
  it("skips listed holidays", () => {
    const r = workingDaysBetween({ start: "2026-10-05", end: "2026-10-12", holidays: ["2026-10-07"] });
    expect(r.workingDays).toBe(5);
    expect(r.holidayDays).toBe(1);
  });
  it("can exclude the end date", () => {
    const r = workingDaysBetween({ start: "2026-10-05", end: "2026-10-09", includeEnd: false });
    expect(r.workingDays).toBe(4);
    expect(r.calendarDays).toBe(4);
  });
  it("rejects end before start and invalid dates", () => {
    expect(() => workingDaysBetween({ start: "2026-10-09", end: "2026-10-05" })).toThrow(/end/i);
    expect(() => workingDaysBetween({ start: "2026-02-30", end: "2026-03-05" })).toThrow(/start/i);
    expect(() => workingDaysBetween({ start: "2026-10-05", end: "2026-10-09", holidays: ["2026-13-01"] })).toThrow(/holiday/i);
  });
});

describe("add working days", () => {
  it("moves from Friday to Monday", () => {
    expect(addWorkingDays({ start: "2026-10-09", days: 1 })).toBe("2026-10-12");
  });
  it("skips a holiday", () => {
    expect(addWorkingDays({ start: "2026-10-09", days: 1, holidays: ["2026-10-12"] })).toBe("2026-10-13");
  });
  it("returns the start for zero days", () => {
    expect(addWorkingDays({ start: "2026-10-10", days: 0 })).toBe("2026-10-10");
  });
  it("enforces whole days within the cap", () => {
    expect(() => addWorkingDays({ start: "2026-10-09", days: 3651 })).toThrow(/3650/);
    expect(() => addWorkingDays({ start: "2026-10-09", days: 1.5 })).toThrow(/whole/i);
  });
  it("formats a local date as YYYY-MM-DD", () => {
    expect(localIsoDate(new Date(2026, 0, 7))).toBe("2026-01-07");
  });
});
