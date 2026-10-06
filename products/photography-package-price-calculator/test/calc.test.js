import { describe, it, expect } from "vitest";
import { packagePrice } from "../public/calc.js";
describe("packagePrice", () => {
  it("prices a package from shoot and editing hours, travel and marked-up products", () => {
    const r = packagePrice({ shootHours: 6, editingHours: 10, hourlyRate: 60, travel: 50, productsCost: 200, productsMarkupPercent: 50 });
    expect(r.laborCost).toBe(960); expect(r.productsPrice).toBe(300); expect(r.packagePrice).toBe(1310); expect(r.profitOnProducts).toBe(100);
  });
  it("prices labour alone when extras are zero", () => {
    const r = packagePrice({ shootHours: 2, hourlyRate: 100 });
    expect(r.packagePrice).toBe(200); expect(r.productsPrice).toBe(0); expect(r.profitOnProducts).toBe(0);
  });
  it("rejects a zero hourly rate", () => {
    expect(() => packagePrice({ shootHours: 6, hourlyRate: 0 })).toThrow(/rate/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => packagePrice({ shootHours: -1, hourlyRate: 60 })).toThrow(/0 or more/);
    expect(() => packagePrice({ shootHours: 6, hourlyRate: 60, travel: NaN })).toThrow(/0 or more/);
  });
});
