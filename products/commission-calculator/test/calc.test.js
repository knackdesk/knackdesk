import { describe, it, expect } from "vitest";
import { flatCommission, tieredCommission, salesForTarget } from "../public/calc.js";

const tiers = [{ upTo: 10000, ratePercent: 5 }, { upTo: 50000, ratePercent: 8 }, { upTo: null, ratePercent: 10 }];

describe("commission", () => {
  it("computes flat commission", () => {
    expect(flatCommission({ amount: 25000, ratePercent: 7 })).toEqual({ commission: 1750, effectiveRate: 7 });
  });
  it("computes tiered commission marginally", () => {
    const r = tieredCommission({ amount: 60000, tiers });
    expect(r.commission).toBe(4700);
    expect(r.effectiveRate).toBe(7.83);
    expect(r.breakdown.map((b) => b.commission)).toEqual([500, 3200, 1000]);
  });
  it("handles an amount inside the first tier", () => {
    const r = tieredCommission({ amount: 5000, tiers });
    expect(r.commission).toBe(250);
    expect(r.effectiveRate).toBe(5);
  });
  it("finds the sales needed for a target", () => {
    expect(salesForTarget({ targetCommission: 3000, ratePercent: 6 })).toBe(50000);
  });
  it("rejects bad tiers and rates", () => {
    expect(() => tieredCommission({ amount: 100, tiers: [{ upTo: 50000, ratePercent: 8 }, { upTo: 10000, ratePercent: 5 }, { upTo: null, ratePercent: 10 }] })).toThrow(/ascending/i);
    expect(() => tieredCommission({ amount: 100, tiers: [{ upTo: 10000, ratePercent: 5 }] })).toThrow(/last tier/i);
    expect(() => salesForTarget({ targetCommission: 3000, ratePercent: 0 })).toThrow(/rate/i);
    expect(() => flatCommission({ amount: -1, ratePercent: 5 })).toThrow(/amount/i);
  });
});
