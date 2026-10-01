import { describe, it, expect } from "vitest";
import { extraPayment } from "../public/calc.js";
describe("extraPayment", () => {
  it("shortens the loan and saves interest", () => {
    const r = extraPayment({ principal: 20000, annualRatePercent: 7, termMonths: 48, extraMonthly: 150 });
    expect(r.scheduledPayment).toBe(478.92); expect(r.scheduledInterest).toBe(2988.16); expect(r.newMonths).toBe(36); expect(r.newInterest).toBe(2186.79); expect(r.interestSaved).toBe(801.37); expect(r.monthsSaved).toBe(12);
  });
  it("changes nothing with no extra payment", () => {
    const r = extraPayment({ principal: 20000, annualRatePercent: 7, termMonths: 48, extraMonthly: 0 });
    expect(r.newMonths).toBe(48); expect(r.monthsSaved).toBe(0);
  });
  it("rejects a zero term", () => {
    expect(() => extraPayment({ principal: 1000, annualRatePercent: 7, termMonths: 0, extraMonthly: 10 })).toThrow(/term/i);
  });
});
