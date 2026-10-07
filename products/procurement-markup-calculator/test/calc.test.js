import { describe, it, expect } from "vitest";
import { procurementMarkup } from "../public/calc.js";
describe("procurementMarkup", () => {
  it("derives the client price from the trade discount and markup", () => {
    const r = procurementMarkup({ retailPrice: 2000, tradeDiscountPercent: 30, markupPercent: 25, clientPrice: 0, freightAndHandling: 60 });
    expect(r.yourCost).toBe(1400); expect(r.clientPriceUsed).toBe(1750); expect(r.grossProfit).toBe(290);
    expect(r.marginPercent).toBe(16.57); expect(r.savingsVsRetail).toBe(250);
  });
  it("uses a client price when one is given", () => {
    const r = procurementMarkup({ retailPrice: 2000, tradeDiscountPercent: 30, markupPercent: 25, clientPrice: 1900, freightAndHandling: 60 });
    expect(r.clientPriceUsed).toBe(1900); expect(r.grossProfit).toBe(440); expect(r.savingsVsRetail).toBe(100);
  });
  it("assumes no discount, markup, client price or freight by default", () => {
    const r = procurementMarkup({ retailPrice: 500 });
    expect(r.yourCost).toBe(500); expect(r.clientPriceUsed).toBe(500); expect(r.grossProfit).toBe(0); expect(r.marginPercent).toBe(0); expect(r.savingsVsRetail).toBe(0);
  });
  it("shows negative savings when the client pays more than retail", () => {
    const r = procurementMarkup({ retailPrice: 1000, tradeDiscountPercent: 10, markupPercent: 50 });
    expect(r.clientPriceUsed).toBe(1350); expect(r.savingsVsRetail).toBe(-350);
  });
  it("returns a margin of 0 when the client price is 0", () => {
    const r = procurementMarkup({ retailPrice: 0, freightAndHandling: 20 });
    expect(r.clientPriceUsed).toBe(0); expect(r.grossProfit).toBe(-20); expect(r.marginPercent).toBe(0);
  });
  it("rejects a trade discount above 100", () => {
    expect(() => procurementMarkup({ retailPrice: 1000, tradeDiscountPercent: 120 })).toThrow("Trade discount cannot be more than 100 percent.");
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => procurementMarkup({ retailPrice: -1 })).toThrow(/0 or more/);
    expect(() => procurementMarkup({ retailPrice: 1000, markupPercent: NaN })).toThrow(/0 or more/);
    expect(() => procurementMarkup({ retailPrice: 1000, freightAndHandling: -5 })).toThrow(/0 or more/);
    expect(() => procurementMarkup({})).toThrow(/0 or more/);
  });
});
