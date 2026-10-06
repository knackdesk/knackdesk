import { describe, it, expect } from "vitest";
import { foodCostPercent, priceForFoodCost } from "../public/calc.js";
describe("foodCostPercent", () => {
  it("turns ingredient cost and menu price into food cost %, gross profit and gross margin", () => {
    const r = foodCostPercent({ ingredientCost: 4.5, menuPrice: 15 });
    expect(r.foodCostPercent).toBe(30); expect(r.grossProfit).toBe(10.5); expect(r.grossMarginPercent).toBe(70);
  });
  it("rejects a zero menu price", () => {
    expect(() => foodCostPercent({ ingredientCost: 4.5, menuPrice: 0 })).toThrow(/price/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => foodCostPercent({ ingredientCost: -1, menuPrice: 15 })).toThrow(/0 or more/);
    expect(() => foodCostPercent({ ingredientCost: NaN, menuPrice: 15 })).toThrow(/0 or more/);
  });
});
describe("priceForFoodCost", () => {
  it("works out the menu price that hits a target food cost percentage", () => {
    expect(priceForFoodCost({ ingredientCost: 4.5, targetFoodCostPercent: 28 }).price).toBe(16.07);
  });
  it("rejects a target of 0 or of 100 and above", () => {
    expect(() => priceForFoodCost({ ingredientCost: 4.5, targetFoodCostPercent: 0 })).toThrow(/target/i);
    expect(() => priceForFoodCost({ ingredientCost: 4.5, targetFoodCostPercent: 100 })).toThrow(/target/i);
    expect(() => priceForFoodCost({ ingredientCost: 4.5, targetFoodCostPercent: 120 })).toThrow(/target/i);
  });
});
