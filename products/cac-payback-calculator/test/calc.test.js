import { describe, it, expect } from "vitest";
import { cacPayback } from "../public/calc.js";

describe("cac payback", () => {
  it("derives CAC from spend and new customers and computes payback months", () => {
    const r = cacPayback({ spend: 30000, newCustomers: 100, arpa: 50, marginPercent: 80 });
    expect(r.cac).toBe(300);
    expect(r.monthlyContribution).toBe(40);
    expect(r.paybackMonths).toBe(7.5);
  });
  it("accepts CAC directly", () => {
    expect(cacPayback({ cac: 600, arpa: 100, marginPercent: 50 }).paybackMonths).toBe(12);
  });
  it("rejects zero contribution and missing inputs", () => {
    expect(() => cacPayback({ cac: 600, arpa: 0, marginPercent: 50 })).toThrow(/revenue/i);
    expect(() => cacPayback({ spend: 100, newCustomers: 0, arpa: 10, marginPercent: 50 })).toThrow(/customers/i);
  });
});
