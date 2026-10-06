import { describe, it, expect } from "vitest";
import { primeCost } from "../public/calc.js";
describe("primeCost", () => {
  it("adds food, beverage and labour cost and compares each with sales", () => {
    const r = primeCost({ sales: 50000, foodCost: 15000, beverageCost: 5000, laborCost: 16000 });
    expect(r.primeCost).toBe(36000); expect(r.primeCostPercent).toBe(72); expect(r.foodPercent).toBe(30);
    expect(r.beveragePercent).toBe(10); expect(r.laborPercent).toBe(32); expect(r.remaining).toBe(14000);
  });
  it("treats missing costs as 0", () => {
    const r = primeCost({ sales: 1000, foodCost: 300 });
    expect(r.primeCost).toBe(300); expect(r.primeCostPercent).toBe(30); expect(r.remaining).toBe(700);
  });
  it("rejects zero sales", () => {
    expect(() => primeCost({ sales: 0, foodCost: 100 })).toThrow(/sales/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => primeCost({ sales: 1000, foodCost: -1 })).toThrow(/0 or more/);
    expect(() => primeCost({ sales: NaN })).toThrow(/0 or more/);
  });
});
