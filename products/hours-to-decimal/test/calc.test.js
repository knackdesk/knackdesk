import { describe, it, expect } from "vitest";
import { toDecimal, toHoursMinutes, sumEntries } from "../public/calc.js";

describe("hours to decimal", () => {
  it("1:30 is 1.5 and 0:20 is 0.33", () => {
    expect(toDecimal("1:30")).toBe(1.5);
    expect(toDecimal("0:20")).toBe(0.33);
  });
  it("accepts h:mm, h.mm-less forms and 'Xh Ym'", () => {
    expect(toDecimal("7:45")).toBe(7.75);
    expect(toDecimal("2h 15m")).toBe(2.25);
    expect(toDecimal("45m")).toBe(0.75);
  });
  it("converts decimal back to hours:minutes", () => {
    expect(toHoursMinutes(1.5)).toBe("1:30");
    expect(toHoursMinutes(0.33)).toBe("0:20");
    expect(toHoursMinutes(8.1)).toBe("8:06");
  });
  it("sums a multiline list of entries and applies a rate", () => {
    const r = sumEntries("1:30\n2h 15m\n0:45", 80);
    expect(r.totalDecimal).toBe(4.5);
    expect(r.totalHm).toBe("4:30");
    expect(r.amount).toBe(360);
    expect(r.count).toBe(3);
  });
  it("rejects garbage and minutes over 59", () => {
    expect(() => toDecimal("abc")).toThrow(/format/i);
    expect(() => toDecimal("1:75")).toThrow(/minutes/i);
  });
});
