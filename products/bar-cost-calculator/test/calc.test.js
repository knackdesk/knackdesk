import { describe, it, expect } from "vitest";
import { barCost } from "../public/calc.js";
const base = { guests: 100, hours: 4, beerPercent: 40, winePercent: 40, spiritsPercent: 20, beerCost: 2.5, wineCost: 3, spiritsCost: 4 };
describe("barCost", () => {
  it("estimates drinks, cost by type, cost per guest and bartenders", () => {
    const r = barCost(base);
    expect(r.totalDrinks).toBe(500); expect(r.beerDrinks).toBe(200); expect(r.wineDrinks).toBe(200); expect(r.spiritsDrinks).toBe(100);
    expect(r.beerCost).toBe(500); expect(r.wineCost).toBe(600); expect(r.spiritsCost).toBe(400);
    expect(r.totalCost).toBe(1500); expect(r.costPerGuest).toBe(15); expect(r.bartenders).toBe(2);
  });
  it("counts only the first-hour rate for a one-hour event", () => {
    expect(barCost({ ...base, hours: 1 }).totalDrinks).toBe(200);
  });
  it("rounds bartenders up", () => {
    expect(barCost({ ...base, guests: 101 }).bartenders).toBe(3);
  });
  it("rejects hours below one", () => {
    expect(() => barCost({ ...base, hours: 0 })).toThrow(/hours/i);
  });
  it("rejects a drinks mix that does not add up to 100", () => {
    expect(() => barCost({ ...base, beerPercent: 50, winePercent: 50, spiritsPercent: 20 })).toThrow(/100/);
  });
  it("rejects zero guests", () => {
    expect(() => barCost({ ...base, guests: 0 })).toThrow(/guests/i);
  });
});
