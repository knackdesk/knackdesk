import { describe, it, expect } from "vitest";
import { rentalYield } from "../public/calc.js";

describe("rental yield", () => {
  it("computes gross and net yield with vacancy, costs and a mortgage", () => {
    expect(rentalYield({ price: 200000, monthlyRent: 1000, annualCosts: 2400, vacancyWeeks: 2, monthlyMortgage: 500 })).toEqual({
      grossYield: 6, annualRent: 11538.46, netIncome: 9138.46, netYield: 4.57, monthlyCashFlow: 261.54,
    });
  });
  it("defaults costs, vacancy and mortgage to zero", () => {
    const r = rentalYield({ price: 200000, monthlyRent: 1000 });
    expect(r.grossYield).toBe(6);
    expect(r.netYield).toBe(6);
    expect(r.monthlyCashFlow).toBe(1000);
  });
  it("rejects a price of zero", () => {
    expect(() => rentalYield({ price: 0, monthlyRent: 1000 })).toThrow(/price/i);
  });
  it("rejects vacancy over 52 weeks", () => {
    expect(() => rentalYield({ price: 200000, monthlyRent: 1000, vacancyWeeks: 60 })).toThrow(/vacancy/i);
  });
  it("rejects negative costs and rent", () => {
    expect(() => rentalYield({ price: 200000, monthlyRent: -1 })).toThrow(/rent/i);
    expect(() => rentalYield({ price: 200000, monthlyRent: 1000, annualCosts: -1 })).toThrow(/costs/i);
    expect(() => rentalYield({ price: 200000, monthlyRent: 1000, monthlyMortgage: Number.NaN })).toThrow(/mortgage/i);
  });
});
