import { describe, it, expect } from "vitest";
import { cateringPrice } from "../public/calc.js";
describe("cateringPrice", () => {
  it("prices an event per guest from food, labour, rentals and a margin on the price", () => {
    const r = cateringPrice({ guests: 100, foodCostPerGuest: 18, laborHours: 40, hourlyRate: 25, rentals: 600, otherCosts: 200, marginPercent: 30 });
    expect(r.foodCost).toBe(1800); expect(r.laborCost).toBe(1000); expect(r.totalCost).toBe(3600);
    expect(r.price).toBe(5142.86); expect(r.pricePerGuest).toBe(51.43); expect(r.profit).toBe(1542.86);
  });
  it("prices at cost when margin and extras are zero", () => {
    const r = cateringPrice({ guests: 10, foodCostPerGuest: 20 });
    expect(r.price).toBe(200); expect(r.pricePerGuest).toBe(20); expect(r.profit).toBe(0);
  });
  it("rejects zero guests", () => {
    expect(() => cateringPrice({ guests: 0, foodCostPerGuest: 18 })).toThrow(/guests/i);
  });
  it("rejects a margin of 100 or more", () => {
    expect(() => cateringPrice({ guests: 100, foodCostPerGuest: 18, marginPercent: 100 })).toThrow(/margin/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => cateringPrice({ guests: 100, foodCostPerGuest: -1 })).toThrow(/0 or more/);
    expect(() => cateringPrice({ guests: 100, foodCostPerGuest: NaN })).toThrow(/0 or more/);
  });
});
