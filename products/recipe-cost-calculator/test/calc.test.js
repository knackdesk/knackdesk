import { describe, it, expect } from "vitest";
import { recipeCost } from "../public/calc.js";
const ingredients = [{ name: "Flour", quantity: 3, unitCost: 2 }, { name: "Butter", quantity: 0.5, unitCost: 5 }];
describe("recipeCost", () => {
  it("adds ingredients, waste and portions into a cost per portion and food cost %", () => {
    const r = recipeCost({ ingredients, wastePercent: 10, portions: 4, menuPrice: 9 });
    expect(r.rawCost).toBe(8.5); expect(r.batchCost).toBe(9.35); expect(r.costPerPortion).toBe(2.34); expect(r.foodCostPercent).toBe(25.97);
  });
  it("uses no waste by default and returns null food cost % without a menu price", () => {
    const r = recipeCost({ ingredients, portions: 2 });
    expect(r.batchCost).toBe(8.5); expect(r.costPerPortion).toBe(4.25); expect(r.foodCostPercent).toBeNull();
  });
  it("rejects zero portions", () => {
    expect(() => recipeCost({ ingredients, portions: 0 })).toThrow(/portions/i);
  });
  it("rejects an empty ingredient list", () => {
    expect(() => recipeCost({ ingredients: [], portions: 4 })).toThrow(/ingredient/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => recipeCost({ ingredients: [{ name: "x", quantity: -1, unitCost: 2 }], portions: 4 })).toThrow(/0 or more/);
    expect(() => recipeCost({ ingredients, wastePercent: NaN, portions: 4 })).toThrow(/0 or more/);
  });
});
