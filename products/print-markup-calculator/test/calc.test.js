import { describe, it, expect } from "vitest";
import { printMarkup, printPriceForMargin } from "../public/calc.js";
describe("printMarkup", () => {
  it("marks up lab cost plus shipping and reports the margin", () => {
    const r = printMarkup({ labCost: 12, shipping: 3, markupPercent: 150 });
    expect(r.cost).toBe(15); expect(r.price).toBe(37.5); expect(r.profit).toBe(22.5); expect(r.marginPercent).toBe(60);
  });
  it("rejects a print with no cost", () => {
    expect(() => printMarkup({ labCost: 0, shipping: 0, markupPercent: 150 })).toThrow(/cost/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => printMarkup({ labCost: -1, markupPercent: 150 })).toThrow(/0 or more/);
    expect(() => printMarkup({ labCost: 12, markupPercent: NaN })).toThrow(/0 or more/);
  });
});
describe("printPriceForMargin", () => {
  it("finds the price that gives a target margin", () => {
    const r = printPriceForMargin({ labCost: 12, shipping: 3, marginPercent: 60 });
    expect(r.price).toBe(37.5); expect(r.profit).toBe(22.5); expect(r.markupPercent).toBe(150);
  });
  it("rejects a margin of 100 or more", () => {
    expect(() => printPriceForMargin({ labCost: 12, shipping: 3, marginPercent: 100 })).toThrow(/margin/i);
  });
  it("rejects a print with no cost", () => {
    expect(() => printPriceForMargin({ labCost: 0, shipping: 0, marginPercent: 60 })).toThrow(/cost/i);
  });
});
