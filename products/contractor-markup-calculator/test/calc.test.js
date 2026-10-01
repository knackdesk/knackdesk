import { describe, it, expect } from "vitest";
import { markupFromCost, markupForMargin, markupForOverheadAndProfit } from "../public/calc.js";
describe("markupFromCost", () => {
  it("prices from a markup and reports the margin", () => {
    const r = markupFromCost({ cost: 1000, markupPercent: 50 });
    expect(r.price).toBe(1500); expect(r.profit).toBe(500); expect(r.marginPercent).toBe(33.33);
  });
  it("rejects a zero cost", () => {
    expect(() => markupFromCost({ cost: 0, markupPercent: 50 })).toThrow(/cost/i);
  });
});
describe("markupForMargin", () => {
  it("finds the markup a target margin needs", () => {
    const r = markupForMargin({ cost: 1000, marginPercent: 40 });
    expect(r.markupPercent).toBe(66.67); expect(r.price).toBe(1666.67);
  });
  it("rejects a margin of 100 or more", () => {
    expect(() => markupForMargin({ cost: 1000, marginPercent: 100 })).toThrow(/margin/i);
  });
});
describe("markupForOverheadAndProfit", () => {
  it("finds the markup that covers overhead and profit as shares of sales", () => {
    const r = markupForOverheadAndProfit({ overheadPercent: 25, profitPercent: 10 });
    expect(r.markupPercent).toBe(53.85); expect(r.marginPercent).toBe(35);
  });
  it("rejects overhead plus profit of 100 or more", () => {
    expect(() => markupForOverheadAndProfit({ overheadPercent: 60, profitPercent: 40 })).toThrow(/100/);
  });
});
