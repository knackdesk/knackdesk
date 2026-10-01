import { describe, it, expect } from "vitest";
import { paintingQuote } from "../public/calc.js";
describe("paintingQuote", () => {
  it("quotes from area, coats, coverage, productivity and markup", () => {
    const r = paintingQuote({ area: 120, coats: 2, coveragePerUnit: 10, pricePerUnit: 8, prepHours: 2, areaPerHour: 20, hourlyRate: 30, markupPercent: 25 });
    expect(r.paintedArea).toBe(240); expect(r.paintUnits).toBe(24); expect(r.paintCost).toBe(192); expect(r.hours).toBe(14); expect(r.laborCost).toBe(420);
    expect(r.subtotal).toBe(612); expect(r.quote).toBe(765); expect(r.pricePerArea).toBe(6.38);
  });
  it("rounds paint units up to whole tins", () => {
    expect(paintingQuote({ area: 95, coats: 1, coveragePerUnit: 10, pricePerUnit: 8, prepHours: 0, areaPerHour: 20, hourlyRate: 30, markupPercent: 0 }).paintUnits).toBe(10);
  });
  it("rejects zero coverage", () => {
    expect(() => paintingQuote({ area: 95, coats: 1, coveragePerUnit: 0, pricePerUnit: 8, prepHours: 0, areaPerHour: 20, hourlyRate: 30, markupPercent: 0 })).toThrow(/coverage/i);
  });
  it("rejects zero area per hour", () => {
    expect(() => paintingQuote({ area: 95, coats: 1, coveragePerUnit: 10, pricePerUnit: 8, prepHours: 0, areaPerHour: 0, hourlyRate: 30, markupPercent: 0 })).toThrow(/per hour/i);
  });
});
