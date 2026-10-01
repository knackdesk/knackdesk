import { describe, it, expect } from "vitest";
import { cashOnCash } from "../public/calc.js";
describe("cashOnCash", () => {
  it("returns annual and monthly cash flow and the return on cash invested", () => {
    const r = cashOnCash({ cashInvested: 75000, annualNoi: 19500, annualDebtService: 15000 });
    expect(r.annualCashFlow).toBe(4500); expect(r.monthlyCashFlow).toBe(375); expect(r.cocPercent).toBe(6);
  });
  it("shows a negative return when debt service exceeds NOI", () => {
    expect(cashOnCash({ cashInvested: 50000, annualNoi: 10000, annualDebtService: 12000 }).cocPercent).toBe(-4);
  });
  it("rejects zero cash invested", () => {
    expect(() => cashOnCash({ cashInvested: 0, annualNoi: 1000, annualDebtService: 0 })).toThrow(/cash invested/i);
  });
});
