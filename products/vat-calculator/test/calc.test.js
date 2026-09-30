import { describe, it, expect } from "vitest";
import { addVat, removeVat } from "../public/calc.js";

describe("vat", () => {
  it("adds 25% to 100", () => {
    expect(addVat({ net: 100, ratePercent: 25 })).toEqual({ net: 100, vat: 25, gross: 125 });
  });
  it("removes 20% from 120", () => {
    expect(removeVat({ gross: 120, ratePercent: 20 })).toEqual({ net: 100, vat: 20, gross: 120 });
  });
  it("removing VAT divides, never multiplies by (1 - rate)", () => {
    const r = removeVat({ gross: 100, ratePercent: 20 });
    expect(r.net).toBe(83.33);
    expect(r.vat).toBe(16.67);
  });
  it("handles a zero rate", () => {
    expect(addVat({ net: 50, ratePercent: 0 })).toEqual({ net: 50, vat: 0, gross: 50 });
  });
  it("rejects negative amounts and rates", () => {
    expect(() => addVat({ net: -1, ratePercent: 20 })).toThrow(/amount/i);
    expect(() => removeVat({ gross: 10, ratePercent: -5 })).toThrow(/rate/i);
  });
});
