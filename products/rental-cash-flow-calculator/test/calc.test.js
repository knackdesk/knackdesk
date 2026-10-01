import { describe, it, expect } from "vitest";
import { rentalCashFlow } from "../public/calc.js";
describe("rentalCashFlow", () => {
  it("subtracts vacancy, expenses and mortgage from rent", () => {
    const r = rentalCashFlow({ monthlyRent: 2500, vacancyPercent: 5, monthlyExpenses: 750, mortgagePayment: 1250 });
    expect(r.effectiveRent).toBe(2375); expect(r.monthlyNoi).toBe(1625); expect(r.cashFlow).toBe(375); expect(r.annualCashFlow).toBe(4500); expect(r.expenseRatioPercent).toBe(31.58);
  });
  it("shows negative cash flow when costs exceed rent", () => {
    expect(rentalCashFlow({ monthlyRent: 1000, vacancyPercent: 0, monthlyExpenses: 400, mortgagePayment: 700 }).cashFlow).toBe(-100);
  });
  it("rejects zero rent", () => {
    expect(() => rentalCashFlow({ monthlyRent: 0, vacancyPercent: 0, monthlyExpenses: 0, mortgagePayment: 0 })).toThrow(/rent/i);
  });
});
