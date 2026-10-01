import { describe, it, expect } from "vitest";
import { netMargin } from "../public/calc.js";
describe("netMargin", () => {
  it("walks from gross to operating to net profit with margins", () => {
    const r = netMargin({ revenue: 100000, cogs: 40000, operatingExpenses: 35000, interest: 2000, taxes: 4600 });
    expect(r.grossProfit).toBe(60000); expect(r.grossMarginPercent).toBe(60);
    expect(r.operatingProfit).toBe(25000); expect(r.operatingMarginPercent).toBe(25);
    expect(r.netProfit).toBe(18400); expect(r.netMarginPercent).toBe(18.4);
  });
  it("shows a loss as a negative net margin", () => {
    expect(netMargin({ revenue: 1000, cogs: 600, operatingExpenses: 500, interest: 0, taxes: 0 }).netMarginPercent).toBe(-10);
  });
  it("rejects zero revenue", () => {
    expect(() => netMargin({ revenue: 0, cogs: 0, operatingExpenses: 0, interest: 0, taxes: 0 })).toThrow(/revenue/i);
  });
});
