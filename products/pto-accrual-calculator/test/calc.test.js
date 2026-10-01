import { describe, it, expect } from "vitest";
import { accrual } from "../public/calc.js";

describe("pto accrual", () => {
  it("computes per-period accrual, accrued to date and balance", () => {
    const r = accrual({ annualDays: 20, frequency: "biweekly", periodsElapsed: 13, carriedOver: 3, taken: 5 });
    expect(r.periodsPerYear).toBe(26);
    expect(r.perPeriod).toBe(0.77);
    expect(r.accruedToDate).toBe(10);
    expect(r.balance).toBe(8);
  });
  it("supports monthly and rejects unknown frequencies", () => {
    expect(accrual({ annualDays: 24, frequency: "monthly", periodsElapsed: 6, carriedOver: 0, taken: 0 }).accruedToDate).toBe(12);
    expect(() => accrual({ annualDays: 24, frequency: "daily", periodsElapsed: 6, carriedOver: 0, taken: 0 })).toThrow(/frequency/i);
  });
  it("rejects periods elapsed above periods per year", () => {
    expect(() => accrual({ annualDays: 20, frequency: "monthly", periodsElapsed: 13, carriedOver: 0, taken: 0 })).toThrow(/periods/i);
  });
});
