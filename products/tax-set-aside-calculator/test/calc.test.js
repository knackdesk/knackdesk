import { describe, it, expect } from "vitest";
import { taxSetAside } from "../public/calc.js";
describe("taxSetAside", () => {
  it("sets aside a share of monthly profit and converts to quarter and year", () => {
    const r = taxSetAside({ income: 8000, expenses: 2000, setAsidePercent: 25, period: "month" });
    expect(r.profit).toBe(6000); expect(r.setAside).toBe(1500); expect(r.perMonth).toBe(1500); expect(r.perQuarter).toBe(4500); expect(r.perYear).toBe(18000);
  });
  it("converts a yearly figure down to months and quarters", () => {
    const r = taxSetAside({ income: 96000, expenses: 24000, setAsidePercent: 25, period: "year" });
    expect(r.profit).toBe(72000); expect(r.perMonth).toBe(1500); expect(r.perQuarter).toBe(4500); expect(r.perYear).toBe(18000);
  });
  it("sets aside nothing on a loss", () => {
    expect(taxSetAside({ income: 1000, expenses: 1500, setAsidePercent: 25, period: "month" }).setAside).toBe(0);
  });
  it("rejects an unknown period", () => {
    expect(() => taxSetAside({ income: 1000, expenses: 0, setAsidePercent: 25, period: "week" })).toThrow(/period/i);
  });
  it("rejects a percentage above 100", () => {
    expect(() => taxSetAside({ income: 1000, expenses: 0, setAsidePercent: 101, period: "month" })).toThrow(/percent/i);
  });
});
