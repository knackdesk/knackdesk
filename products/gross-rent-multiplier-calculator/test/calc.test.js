import { describe, it, expect } from "vitest";
import { grossRentMultiplier, priceForGrm } from "../public/calc.js";
describe("grossRentMultiplier", () => {
  it("divides price by annual rent and gives the monthly rent-to-price ratio", () => {
    const r = grossRentMultiplier({ price: 300000, annualRent: 30000 });
    expect(r.grm).toBe(10); expect(r.monthlyRent).toBe(2500); expect(r.rentToPricePercent).toBe(0.83);
  });
  it("rejects zero rent", () => {
    expect(() => grossRentMultiplier({ price: 300000, annualRent: 0 })).toThrow(/rent/i);
  });
});
describe("priceForGrm", () => {
  it("finds the price a target multiplier implies", () => {
    expect(priceForGrm({ annualRent: 30000, targetGrm: 8 })).toBe(240000);
  });
});
