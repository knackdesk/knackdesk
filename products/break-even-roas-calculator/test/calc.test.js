import { describe, it, expect } from "vitest";
import { roas, contributionMargin } from "../public/calc.js";

describe("break-even roas", () => {
  it("computes contribution margin from price, cost and fees", () => {
    expect(contributionMargin({ price: 50, cost: 20, feesPercent: 10, otherCosts: 5 })).toBe(40);
  });
  it("computes break-even and target ROAS", () => {
    const r = roas({ marginPercent: 40, targetProfitPercent: 10 });
    expect(r.breakEvenRoas).toBe(2.5);
    expect(r.targetRoas).toBe(3.33);
    expect(r.maxCpaPercent).toBe(40);
  });
  it("rejects target profit at or above margin and zero margin", () => {
    expect(() => roas({ marginPercent: 40, targetProfitPercent: 40 })).toThrow(/target/i);
    expect(() => roas({ marginPercent: 0, targetProfitPercent: 0 })).toThrow(/margin/i);
  });
});
