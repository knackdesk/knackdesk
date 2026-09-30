import { describe, it, expect } from "vitest";
import { applyIncrease, percentBetween, increaseToKeepMargin } from "../public/calc.js";

describe("price increase", () => {
  it("applies a percentage increase", () => {
    expect(applyIncrease({ price: 80, percent: 12.5 })).toEqual({ newPrice: 90, difference: 10 });
  });
  it("finds the percentage between two prices", () => {
    expect(percentBetween({ oldPrice: 80, newPrice: 100 })).toBe(25);
    expect(percentBetween({ oldPrice: 100, newPrice: 80 })).toBe(-20);
  });
  it("finds the price that keeps the same margin after a cost rise", () => {
    // cost 60 -> 66, old price 100 (40% margin) -> new price 110
    expect(increaseToKeepMargin({ oldCost: 60, newCost: 66, oldPrice: 100 })).toEqual({ newPrice: 110, increasePercent: 10, marginPercent: 40 });
  });
  it("rejects zero old price and negative inputs", () => {
    expect(() => percentBetween({ oldPrice: 0, newPrice: 10 })).toThrow(/old price/i);
    expect(() => applyIncrease({ price: -1, percent: 5 })).toThrow(/price/i);
    expect(() => increaseToKeepMargin({ oldCost: 100, newCost: 110, oldPrice: 100 })).toThrow(/margin/i);
  });
});
