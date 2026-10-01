import { describe, it, expect } from "vitest";
import { dscr } from "../public/calc.js";
describe("dscr", () => {
  it("divides net operating income by debt service and sizes the payment for a target", () => {
    const r = dscr({ netOperatingIncome: 120000, annualDebtService: 80000, targetRatio: 1.25 });
    expect(r.ratio).toBe(1.5); expect(r.maxAnnualDebtService).toBe(96000); expect(r.maxMonthlyPayment).toBe(8000); expect(r.meetsTarget).toBe(true);
  });
  it("flags a ratio below the target", () => {
    expect(dscr({ netOperatingIncome: 90000, annualDebtService: 80000, targetRatio: 1.25 }).meetsTarget).toBe(false);
  });
  it("rejects zero debt service", () => {
    expect(() => dscr({ netOperatingIncome: 1000, annualDebtService: 0, targetRatio: 1.25 })).toThrow(/debt service/i);
  });
  it("rejects a target below 0.01", () => {
    expect(() => dscr({ netOperatingIncome: 1000, annualDebtService: 500, targetRatio: 0 })).toThrow(/target/i);
  });
});
