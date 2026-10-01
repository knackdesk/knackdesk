import { describe, it, expect } from "vitest";
import { ltv } from "../public/calc.js";

describe("ltv", () => {
  it("computes lifetime, LTV and LTV:CAC", () => {
    const r = ltv({ arpa: 50, marginPercent: 80, churnPercent: 4, cac: 300 });
    expect(r.lifetimeMonths).toBe(25);
    expect(r.ltv).toBe(1000);
    expect(r.ltvToCac).toBe(3.33);
  });
  it("works without CAC", () => {
    expect(ltv({ arpa: 50, marginPercent: 100, churnPercent: 5 }).ltvToCac).toBeNull();
  });
  it("rejects zero churn and margin over 100", () => {
    expect(() => ltv({ arpa: 50, marginPercent: 80, churnPercent: 0 })).toThrow(/churn/i);
    expect(() => ltv({ arpa: 50, marginPercent: 101, churnPercent: 5 })).toThrow(/margin/i);
  });
});
