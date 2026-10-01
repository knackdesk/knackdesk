import { describe, it, expect } from "vitest";
import { craftPrice } from "../public/calc.js";
describe("craftPrice", () => {
  it("builds cost, wholesale and retail from materials, labour, overhead and markups", () => {
    const r = craftPrice({ materials: 8, laborHours: 1.5, hourlyRate: 20, overheadPercent: 10, wholesaleMarkup: 2, retailMarkup: 2 });
    expect(r.laborCost).toBe(30); expect(r.baseCost).toBe(38); expect(r.overhead).toBe(3.8); expect(r.totalCost).toBe(41.8);
    expect(r.wholesale).toBe(83.6); expect(r.retail).toBe(167.2); expect(r.wholesaleProfit).toBe(41.8);
  });
  it("accepts zero overhead and a single markup", () => {
    const r = craftPrice({ materials: 10, laborHours: 0, hourlyRate: 20, overheadPercent: 0, wholesaleMarkup: 2.5, retailMarkup: 1 });
    expect(r.totalCost).toBe(10); expect(r.wholesale).toBe(25); expect(r.retail).toBe(25);
  });
  it("rejects a markup below 1", () => {
    expect(() => craftPrice({ materials: 8, laborHours: 1, hourlyRate: 20, overheadPercent: 0, wholesaleMarkup: 0.5, retailMarkup: 2 })).toThrow(/markup/i);
  });
  it("rejects negative materials", () => {
    expect(() => craftPrice({ materials: -1, laborHours: 1, hourlyRate: 20, overheadPercent: 0, wholesaleMarkup: 2, retailMarkup: 2 })).toThrow(/materials/i);
  });
});
