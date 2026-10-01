import { describe, it, expect } from "vitest";
import { capRate, priceForCapRate } from "../public/calc.js";
describe("capRate", () => {
  it("computes effective income, NOI and cap rate", () => {
    const r = capRate({ purchasePrice: 300000, annualRent: 30000, vacancyPercent: 5, operatingExpenses: 9000 });
    expect(r.vacancyLoss).toBe(1500); expect(r.effectiveIncome).toBe(28500); expect(r.noi).toBe(19500); expect(r.capRatePercent).toBe(6.5); expect(r.expenseRatioPercent).toBe(31.58);
  });
  it("rejects a zero price", () => {
    expect(() => capRate({ purchasePrice: 0, annualRent: 1000, vacancyPercent: 0, operatingExpenses: 0 })).toThrow(/price/i);
  });
  it("rejects vacancy of 100 or more", () => {
    expect(() => capRate({ purchasePrice: 1000, annualRent: 1000, vacancyPercent: 100, operatingExpenses: 0 })).toThrow(/vacancy/i);
  });
});
describe("priceForCapRate", () => {
  it("finds the price a target cap rate implies", () => {
    expect(priceForCapRate({ noi: 19500, targetCapPercent: 7 })).toBe(278571.43);
  });
  it("rejects a zero target", () => {
    expect(() => priceForCapRate({ noi: 19500, targetCapPercent: 0 })).toThrow(/cap rate/i);
  });
});
