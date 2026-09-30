import { describe, it, expect } from "vitest";
import { solve } from "../public/calc.js";

describe("markup and margin", () => {
  it("cost + price gives markup and margin", () => {
    expect(solve({ cost: 80, price: 100 })).toEqual({ cost: 80, price: 100, profit: 20, markupPercent: 25, marginPercent: 20 });
  });
  it("cost + markup gives price and margin", () => {
    expect(solve({ cost: 50, markupPercent: 100 })).toEqual({ cost: 50, price: 100, profit: 50, markupPercent: 100, marginPercent: 50 });
  });
  it("cost + margin gives price and markup", () => {
    expect(solve({ cost: 60, marginPercent: 40 })).toEqual({ cost: 60, price: 100, profit: 40, markupPercent: 66.67, marginPercent: 40 });
  });
  it("price + margin gives cost and markup", () => {
    expect(solve({ price: 200, marginPercent: 25 })).toEqual({ cost: 150, price: 200, profit: 50, markupPercent: 33.33, marginPercent: 25 });
  });
  it("price + markup gives cost and margin", () => {
    expect(solve({ price: 120, markupPercent: 20 })).toEqual({ cost: 100, price: 120, profit: 20, markupPercent: 20, marginPercent: 16.67 });
  });
  it("rejects margin of 100 percent or more and fewer than two inputs", () => {
    expect(() => solve({ cost: 10, marginPercent: 100 })).toThrow(/margin/i);
    expect(() => solve({ cost: 10 })).toThrow(/two/i);
  });
});

describe("markup margin (review fixes)", () => {
  it("rejects more than two filled values", () => {
    expect(() => solve({ cost: 80, price: 100, markupPercent: 99 })).toThrow(/exactly two/i);
  });
});
