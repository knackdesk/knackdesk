import { describe, it, expect } from "vitest";
import { ratio, maxRent, incomeNeeded } from "../public/calc.js";

describe("rent to income", () => {
  it("finds rent as a percentage of income", () => {
    expect(ratio({ monthlyIncome: 4000, monthlyRent: 1200 })).toEqual({ percent: 30 });
  });
  it("finds the maximum rent at a target ratio", () => {
    expect(maxRent({ monthlyIncome: 4000, targetPercent: 30 })).toEqual({ maxRent: 1200 });
  });
  it("finds the income needed for a rent at a target ratio", () => {
    expect(incomeNeeded({ monthlyRent: 1500, targetPercent: 30 })).toEqual({ income: 5000 });
  });
  it("rejects an income of zero", () => {
    expect(() => ratio({ monthlyIncome: 0, monthlyRent: 1200 })).toThrow(/income/i);
    expect(() => maxRent({ monthlyIncome: 0, targetPercent: 30 })).toThrow(/income/i);
  });
  it("rejects a target outside 1 to 100", () => {
    expect(() => maxRent({ monthlyIncome: 4000, targetPercent: 0 })).toThrow(/target/i);
    expect(() => incomeNeeded({ monthlyRent: 1500, targetPercent: 101 })).toThrow(/target/i);
  });
  it("rejects a negative rent", () => {
    expect(() => ratio({ monthlyIncome: 4000, monthlyRent: -1 })).toThrow(/rent/i);
  });
});
