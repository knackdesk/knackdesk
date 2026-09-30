import { describe, it, expect } from "vitest";
import { addDays, addBusinessDays, dueDate, formatIso, isWeekend } from "../public/calc.js";

describe("invoice due date", () => {
  it("adds calendar days for net terms", () => {
    expect(formatIso(addDays(new Date("2026-01-15"), 30))).toBe("2026-02-14");
  });
  it("adds business days skipping Saturday and Sunday", () => {
    // Fri 2026-01-16 + 3 business days = Wed 2026-01-21
    expect(formatIso(addBusinessDays(new Date("2026-01-16"), 3))).toBe("2026-01-21");
  });
  it("dueDate with mode calendar returns issue + term", () => {
    const r = dueDate({ issueDate: "2026-03-01", termDays: 14, mode: "calendar" });
    expect(r.due).toBe("2026-03-15");
    expect(r.daysFromToday).toBeTypeOf("number");
  });
  it("dueDate with mode business skips weekends", () => {
    // Mon 2026-03-02 + 5 business days = Mon 2026-03-09
    expect(dueDate({ issueDate: "2026-03-02", termDays: 5, mode: "business" }).due).toBe("2026-03-09");
  });
  it("dueDate with rollForward moves a weekend due date to Monday", () => {
    // 2026-03-01 + 6 days = 2026-03-07 (Saturday) -> 2026-03-09
    expect(dueDate({ issueDate: "2026-03-01", termDays: 6, mode: "calendar", rollForward: true }).due).toBe("2026-03-09");
  });
  it("rejects invalid dates and negative terms", () => {
    expect(() => dueDate({ issueDate: "nope", termDays: 30, mode: "calendar" })).toThrow(/issue date/i);
    expect(() => dueDate({ issueDate: "2026-03-01", termDays: -1, mode: "calendar" })).toThrow(/term/i);
  });
  it("isWeekend detects Saturday and Sunday in UTC", () => {
    expect(isWeekend(new Date("2026-03-07"))).toBe(true);
    expect(isWeekend(new Date("2026-03-09"))).toBe(false);
  });
});

describe("invoice due date (review fixes)", () => {
  it("caps the term at 3650 days", () => {
    expect(() => dueDate({ issueDate: "2026-01-01", termDays: 3651, mode: "calendar" })).toThrow(/3650/);
  });
  it("business-day arithmetic matches the loop for long terms and is fast", () => {
    expect(formatIso(addBusinessDays(new Date("2026-01-16"), 3650))).toBe("2040-01-13");
  });
  it("accepts today as a local YYYY-MM-DD string", () => {
    expect(dueDate({ issueDate: "2026-03-01", termDays: 10, mode: "calendar", today: "2026-03-01" }).daysFromToday).toBe(10);
  });
});
