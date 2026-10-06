import { describe, it, expect } from "vitest";
import { costPerNewPatient } from "../public/calc.js";
describe("costPerNewPatient", () => {
  it("turns marketing spend, new patients, first-year value, retention and years into cost per patient, lifetime value and break-even", () => {
    const r = costPerNewPatient({ marketingSpend: 3000, newPatients: 20, firstYearValue: 900, retentionPercent: 60, yearsRetained: 3 });
    expect(r.costPerNewPatient).toBe(150); expect(r.lifetimeValue).toBe(1980); expect(r.valueToCostRatio).toBe(13.2);
    expect(r.netValuePerPatient).toBe(1830); expect(r.breakEvenNewPatients).toBe(3.33);
  });
  it("assumes no first-year value, full retention and one year by default and returns a null break-even", () => {
    const r = costPerNewPatient({ marketingSpend: 1000, newPatients: 10 });
    expect(r.costPerNewPatient).toBe(100); expect(r.lifetimeValue).toBe(0); expect(r.valueToCostRatio).toBe(0);
    expect(r.netValuePerPatient).toBe(-100); expect(r.breakEvenNewPatients).toBeNull();
  });
  it("uses only first-year value when one year is retained", () => {
    const r = costPerNewPatient({ marketingSpend: 1000, newPatients: 10, firstYearValue: 500, retentionPercent: 50, yearsRetained: 1 });
    expect(r.lifetimeValue).toBe(500); expect(r.valueToCostRatio).toBe(5); expect(r.breakEvenNewPatients).toBe(2);
  });
  it("returns a null value-to-cost ratio when marketing spend is 0", () => {
    const r = costPerNewPatient({ marketingSpend: 0, newPatients: 5, firstYearValue: 400 });
    expect(r.costPerNewPatient).toBe(0); expect(r.valueToCostRatio).toBeNull(); expect(r.breakEvenNewPatients).toBe(0);
  });
  it("rejects new patients of 0", () => {
    expect(() => costPerNewPatient({ marketingSpend: 1000, newPatients: 0 })).toThrow(/New patients must be more than 0/);
  });
  it("rejects a retention percentage above 100", () => {
    expect(() => costPerNewPatient({ marketingSpend: 1000, newPatients: 5, retentionPercent: 101 })).toThrow(/between 0 and 100/);
  });
  it("rejects years retained below 1", () => {
    expect(() => costPerNewPatient({ marketingSpend: 1000, newPatients: 5, yearsRetained: 0.5 })).toThrow(/Years retained must be 1 or more/);
  });
  it("rejects negative, non-numeric or missing input", () => {
    expect(() => costPerNewPatient({ marketingSpend: -1, newPatients: 5 })).toThrow(/0 or more/);
    expect(() => costPerNewPatient({ marketingSpend: 1000, newPatients: 5, firstYearValue: NaN })).toThrow(/First-year value/);
    expect(() => costPerNewPatient({ newPatients: 5 })).toThrow(/Marketing spend/);
  });
});
