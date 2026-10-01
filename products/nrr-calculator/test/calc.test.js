import { describe, it, expect } from "vitest";
import { retention } from "../public/calc.js";

describe("nrr", () => {
  it("computes NRR and GRR from cohort movements", () => {
    const r = retention({ startMrr: 10000, expansion: 1500, contraction: 300, churned: 700 });
    expect(r.endMrr).toBe(10500);
    expect(r.nrr).toBe(105);
    expect(r.grr).toBe(90);
  });
  it("caps GRR at 100 and allows NRR above 100", () => {
    const r = retention({ startMrr: 1000, expansion: 500, contraction: 0, churned: 0 });
    expect(r.grr).toBe(100);
    expect(r.nrr).toBe(150);
  });
  it("rejects zero start and losses above start", () => {
    expect(() => retention({ startMrr: 0, expansion: 0, contraction: 0, churned: 0 })).toThrow(/start/i);
    expect(() => retention({ startMrr: 100, expansion: 0, contraction: 60, churned: 50 })).toThrow(/exceed/i);
  });
});
