import { describe, it, expect } from "vitest";
import { runway } from "../public/calc.js";

describe("cash runway", () => {
  it("computes burn, months and run-out month", () => {
    const r = runway({ cash: 24000, monthlyIncome: 3000, monthlyCosts: 7000, today: "2026-10-01" });
    expect(r.burn).toBe(4000);
    expect(r.months).toBe(6);
    expect(r.runOutDate).toBe("2027-04");
    expect(r.costsForTarget).toBeNull();
  });
  it("finds the costs and cut needed for a target runway", () => {
    const r = runway({ cash: 24000, monthlyIncome: 3000, monthlyCosts: 7000, targetMonths: 12, today: "2026-10-01" });
    expect(r.costsForTarget).toBe(5000);
    expect(r.cutNeeded).toBe(2000);
  });
  it("uses whole months for the run-out date when runway is fractional", () => {
    const r = runway({ cash: 10000, monthlyIncome: 0, monthlyCosts: 3000, today: "2026-11-20" });
    expect(r.months).toBe(3.33);
    expect(r.runOutDate).toBe("2027-02");
  });
  it("returns null months when income covers costs", () => {
    const r = runway({ cash: 5000, monthlyIncome: 7000, monthlyCosts: 7000, targetMonths: 12 });
    expect(r.months).toBeNull();
    expect(r.runOutDate).toBeNull();
    expect(r.costsForTarget).toBeNull();
  });
  it("rejects invalid inputs naming the field", () => {
    expect(() => runway({ cash: -1, monthlyIncome: 0, monthlyCosts: 100 })).toThrow(/cash/i);
    expect(() => runway({ cash: 100, monthlyIncome: NaN, monthlyCosts: 100 })).toThrow(/income/i);
    expect(() => runway({ cash: 100, monthlyIncome: 0, monthlyCosts: -5 })).toThrow(/costs/i);
    expect(() => runway({ cash: 100, monthlyIncome: 0, monthlyCosts: 50, targetMonths: 0 })).toThrow(/target/i);
    expect(() => runway({ cash: 100, monthlyIncome: 0, monthlyCosts: 50, today: "2026-02-30" })).toThrow(/date/i);
  });
});
