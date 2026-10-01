import { describe, it, expect } from "vitest";
import { applyIncrease, percentBetween, capCheck } from "../public/calc.js";

describe("rent increase", () => {
  it("applies a percentage increase", () => {
    expect(applyIncrease({ rent: 1200, percent: 5 })).toEqual({ newRent: 1260, monthlyDifference: 60, yearlyDifference: 720 });
  });
  it("finds the percentage between two rents", () => {
    expect(percentBetween({ oldRent: 1200, newRent: 1300 })).toEqual({ percent: 8.33, monthlyDifference: 100, yearlyDifference: 1200 });
  });
  it("handles a decrease as a negative percentage", () => {
    expect(percentBetween({ oldRent: 1000, newRent: 950 }).percent).toBe(-5);
  });
  it("checks a new rent against a cap the user enters", () => {
    expect(capCheck({ oldRent: 1200, newRent: 1300, capPercent: 5 })).toEqual({ percent: 8.33, capPercent: 5, withinCap: false, maxRentAtCap: 1260 });
    expect(capCheck({ oldRent: 1200, newRent: 1260, capPercent: 5 }).withinCap).toBe(true);
  });
  it("compares the rounded new rent with the cap", () => {
    expect(capCheck({ oldRent: 1200, newRent: 1260.004, capPercent: 5 }).withinCap).toBe(true);
  });
  it("rejects an old rent of zero", () => {
    expect(() => percentBetween({ oldRent: 0, newRent: 100 })).toThrow(/old rent/i);
    expect(() => capCheck({ oldRent: 0, newRent: 100, capPercent: 5 })).toThrow(/old rent/i);
  });
  it("rejects bad numbers", () => {
    expect(() => applyIncrease({ rent: -5, percent: 5 })).toThrow(/rent/i);
    expect(() => applyIncrease({ rent: 1000, percent: Number.NaN })).toThrow(/increase/i);
    expect(() => applyIncrease({ rent: 1000, percent: -100 })).toThrow(/increase/i);
    expect(() => capCheck({ oldRent: 1000, newRent: 1100, capPercent: -1 })).toThrow(/cap/i);
  });
});
