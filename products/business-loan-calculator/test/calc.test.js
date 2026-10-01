import { describe, it, expect } from "vitest";
import { loanPayment, maxPrincipal } from "../public/calc.js";
describe("loanPayment", () => {
  it("amortises a loan into a monthly payment with totals", () => {
    const r = loanPayment({ principal: 50000, annualRatePercent: 6, termMonths: 60 });
    expect(r.payment).toBe(966.64); expect(r.totalRepaid).toBe(57998.4); expect(r.totalInterest).toBe(7998.4);
  });
  it("handles a zero interest rate", () => {
    expect(loanPayment({ principal: 12000, annualRatePercent: 0, termMonths: 24 }).payment).toBe(500);
  });
  it("rejects a zero term", () => {
    expect(() => loanPayment({ principal: 1000, annualRatePercent: 5, termMonths: 0 })).toThrow(/term/i);
  });
});
describe("maxPrincipal", () => {
  it("finds the loan a monthly payment supports", () => {
    expect(maxPrincipal({ payment: 1000, annualRatePercent: 6, termMonths: 60 })).toBe(51725.56);
  });
});
