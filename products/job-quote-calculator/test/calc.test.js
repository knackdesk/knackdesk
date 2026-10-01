import { describe, it, expect } from "vitest";
import { jobQuote } from "../public/calc.js";
describe("jobQuote", () => {
  it("prices a job from cost, overhead and a profit margin on the price", () => {
    const r = jobQuote({ materials: 1200, laborHours: 16, hourlyRate: 45, subcontractors: 300, overheadPercent: 15, marginPercent: 20 });
    expect(r.laborCost).toBe(720); expect(r.directCost).toBe(2220); expect(r.overhead).toBe(333); expect(r.totalCost).toBe(2553);
    expect(r.price).toBe(3191.25); expect(r.profit).toBe(638.25); expect(r.markupPercent).toBe(25);
  });
  it("prices at cost when margin is zero", () => {
    expect(jobQuote({ materials: 100, laborHours: 0, hourlyRate: 0, subcontractors: 0, overheadPercent: 0, marginPercent: 0 }).price).toBe(100);
  });
  it("rejects a margin of 100 or more", () => {
    expect(() => jobQuote({ materials: 100, laborHours: 0, hourlyRate: 0, subcontractors: 0, overheadPercent: 0, marginPercent: 100 })).toThrow(/margin/i);
  });
});
