import { describe, it, expect } from "vitest";
import { mrr, project } from "../public/calc.js";

describe("mrr", () => {
  it("sums monthly and annual plans into MRR, ARR and ARPA", () => {
    const r = mrr({ plans: [{ name: "Basic", price: 10, period: "month", customers: 100 }, { name: "Pro", price: 240, period: "year", customers: 50 }] });
    expect(r.mrr).toBe(2000);
    expect(r.arr).toBe(24000);
    expect(r.customers).toBe(150);
    expect(r.arpa).toBe(13.33);
    expect(r.plans[1].mrr).toBe(1000);
  });
  it("projects MRR with compound monthly growth", () => {
    expect(project({ mrr: 1000, growthPercent: 10, months: 12 })).toBe(3138.43);
    expect(project({ mrr: 1000, growthPercent: 0, months: 6 })).toBe(1000);
  });
  it("rejects bad periods and negative inputs", () => {
    expect(() => mrr({ plans: [{ name: "x", price: 10, period: "week", customers: 1 }] })).toThrow(/period/i);
    expect(() => mrr({ plans: [{ name: "x", price: -1, period: "month", customers: 1 }] })).toThrow(/price/i);
    expect(() => mrr({ plans: [] })).toThrow(/plan/i);
  });
});
