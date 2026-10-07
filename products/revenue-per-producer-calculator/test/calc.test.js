import { describe, it, expect } from "vitest";
import { revenuePerProducer } from "../public/calc.js";
describe("revenuePerProducer", () => {
  it("turns commission revenue, producers, support staff, compensation and new business into per-head figures and ratios", () => {
    const r = revenuePerProducer({ annualCommissionRevenue: 600000, producers: 4, supportStaff: 3, producerCompensation: 210000, newBusinessRevenue: 150000 });
    expect(r.revenuePerProducer).toBe(150000); expect(r.revenuePerEmployee).toBe(85714.29); expect(r.compensationRatioPercent).toBe(35);
    expect(r.newBusinessSharePercent).toBe(25); expect(r.newBusinessPerProducer).toBe(37500);
  });
  it("assumes no support staff, compensation or new business by default", () => {
    const r = revenuePerProducer({ annualCommissionRevenue: 300000, producers: 2 });
    expect(r.revenuePerProducer).toBe(150000); expect(r.revenuePerEmployee).toBe(150000); expect(r.compensationRatioPercent).toBe(0);
    expect(r.newBusinessSharePercent).toBe(0); expect(r.newBusinessPerProducer).toBe(0);
  });
  it("returns 0 ratios when revenue is 0", () => {
    const r = revenuePerProducer({ annualCommissionRevenue: 0, producers: 3, producerCompensation: 50000 });
    expect(r.revenuePerProducer).toBe(0); expect(r.compensationRatioPercent).toBe(0); expect(r.newBusinessSharePercent).toBe(0);
  });
  it("allows part-time producers as fractions", () => {
    const r = revenuePerProducer({ annualCommissionRevenue: 100000, producers: 2.5 });
    expect(r.revenuePerProducer).toBe(40000);
  });
  it("rejects producers of 0", () => {
    expect(() => revenuePerProducer({ annualCommissionRevenue: 100000, producers: 0 })).toThrow(/Producers must be more than 0/);
  });
  it("rejects new business revenue greater than commission revenue", () => {
    expect(() => revenuePerProducer({ annualCommissionRevenue: 100000, producers: 1, newBusinessRevenue: 100001 })).toThrow(/cannot be more than annual commission revenue/);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => revenuePerProducer({ annualCommissionRevenue: -1, producers: 1 })).toThrow(/0 or more/);
    expect(() => revenuePerProducer({ annualCommissionRevenue: 1000, producers: 1, supportStaff: NaN })).toThrow(/Support staff/);
    expect(() => revenuePerProducer({ producers: 1 })).toThrow(/Annual commission revenue/);
  });
});
