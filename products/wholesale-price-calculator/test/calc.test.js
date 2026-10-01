import { describe, it, expect } from "vitest";
import { wholesaleFromCost, wholesaleFromRetail } from "../public/calc.js";
describe("wholesaleFromCost", () => {
  it("works forward from cost and margin to wholesale and retail", () => {
    const r = wholesaleFromCost({ cost: 10, wholesaleMarginPercent: 50, retailMultiplier: 2 });
    expect(r.wholesale).toBe(20); expect(r.retail).toBe(40); expect(r.wholesaleProfit).toBe(10); expect(r.retailerProfit).toBe(20); expect(r.retailMarginPercent).toBe(50); expect(r.retailMarkupOnCost).toBe(4);
  });
  it("rejects a margin of 100 or more", () => {
    expect(() => wholesaleFromCost({ cost: 10, wholesaleMarginPercent: 100, retailMultiplier: 2 })).toThrow(/margin/i);
  });
});
describe("wholesaleFromRetail", () => {
  it("works back from retail to wholesale and your margin", () => {
    const r = wholesaleFromRetail({ retail: 40, retailMultiplier: 2, cost: 10 });
    expect(r.wholesale).toBe(20); expect(r.wholesaleMarginPercent).toBe(50); expect(r.wholesaleProfit).toBe(10);
  });
  it("rejects a multiplier below 1", () => {
    expect(() => wholesaleFromRetail({ retail: 40, retailMultiplier: 0.5, cost: 10 })).toThrow(/multiplier/i);
  });
});
