import { describe, it, expect } from "vitest";
import { threshold } from "../public/calc.js";

describe("free shipping threshold", () => {
  it("finds the break-even threshold and the cost of a chosen threshold", () => {
    const r = threshold({ aov: 45, marginPercent: 40, shippingCost: 8, chosenThreshold: 50 });
    expect(r.breakEvenThreshold).toBe(20);
    expect(r.upliftNeeded).toBe(0);
    expect(r.chosenUplift).toBe(5);
    expect(r.profitAtChosen).toBe(12);
    expect(r.extraProfitAtChosen).toBe(12);
  });
  it("shows negative extra profit when the chosen threshold is below break-even", () => {
    const r = threshold({ aov: 45, marginPercent: 20, shippingCost: 8, chosenThreshold: 30 });
    expect(r.breakEvenThreshold).toBe(40);
    expect(r.extraProfitAtChosen).toBe(-2);
  });
  it("rejects zero margin", () => {
    expect(() => threshold({ aov: 45, marginPercent: 0, shippingCost: 8, chosenThreshold: 50 })).toThrow(/margin/i);
  });
});
