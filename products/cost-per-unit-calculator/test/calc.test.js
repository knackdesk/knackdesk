import { describe, it, expect } from "vitest";
import { costPerUnit } from "../public/calc.js";
describe("costPerUnit", () => {
  it("divides the batch cost by units made", () => {
    const r = costPerUnit({ ingredients: 40, packaging: 12, laborHours: 2, hourlyRate: 15, other: 5, unitsMade: 24, wastePercent: 0 });
    expect(r.laborCost).toBe(30); expect(r.batchCost).toBe(87); expect(r.usableUnits).toBe(24); expect(r.perUnit).toBe(3.63);
  });
  it("raises the per-unit cost when waste reduces usable units", () => {
    const r = costPerUnit({ ingredients: 40, packaging: 12, laborHours: 2, hourlyRate: 15, other: 5, unitsMade: 24, wastePercent: 4 });
    expect(r.usableUnits).toBe(23.04); expect(r.perUnit).toBe(3.78);
  });
  it("rejects zero units", () => {
    expect(() => costPerUnit({ ingredients: 40, packaging: 0, laborHours: 0, hourlyRate: 0, other: 0, unitsMade: 0, wastePercent: 0 })).toThrow(/units/i);
  });
  it("rejects 100 percent waste", () => {
    expect(() => costPerUnit({ ingredients: 40, packaging: 0, laborHours: 0, hourlyRate: 0, other: 0, unitsMade: 10, wastePercent: 100 })).toThrow(/waste/i);
  });
});
