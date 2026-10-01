import { describe, it, expect } from "vitest";
import { loanApr } from "../public/calc.js";
describe("loanApr", () => {
  it("raises the APR above the quoted rate when fees are charged", () => {
    const r = loanApr({ principal: 10000, annualRatePercent: 8, termMonths: 36, fees: 300 });
    expect(r.payment).toBe(313.36); expect(r.aprPercent).toBe(10.08); expect(r.totalCost).toBe(1580.96); expect(r.netAdvance).toBe(9700);
  });
  it("equals the quoted rate when there are no fees", () => {
    expect(loanApr({ principal: 10000, annualRatePercent: 8, termMonths: 36, fees: 0 }).aprPercent).toBe(8);
  });
  it("rejects fees that equal or exceed the loan", () => {
    expect(() => loanApr({ principal: 1000, annualRatePercent: 8, termMonths: 12, fees: 1000 })).toThrow(/fees/i);
  });
});
