import { describe, it, expect } from "vitest";
import { projectBudgetAllocation } from "../public/calc.js";
describe("projectBudgetAllocation", () => {
  it("splits a budget into design fee, furniture, construction and contingency", () => {
    const r = projectBudgetAllocation({ totalBudget: 100000, designFeePercent: 12, furniturePercent: 45, constructionPercent: 33, contingencyPercent: 8 });
    expect(r.designFee).toBe(12000); expect(r.furniture).toBe(45000); expect(r.construction).toBe(33000); expect(r.contingency).toBe(8000);
    expect(r.allocatedPercent).toBe(98); expect(r.allocatedAmount).toBe(98000); expect(r.remaining).toBe(2000);
  });
  it("leaves the whole budget unallocated by default", () => {
    const r = projectBudgetAllocation({ totalBudget: 40000 });
    expect(r.designFee).toBe(0); expect(r.allocatedPercent).toBe(0); expect(r.allocatedAmount).toBe(0); expect(r.remaining).toBe(40000);
  });
  it("returns a negative remainder when the budget is over-allocated", () => {
    const r = projectBudgetAllocation({ totalBudget: 50000, designFeePercent: 20, furniturePercent: 50, constructionPercent: 30, contingencyPercent: 10 });
    expect(r.allocatedPercent).toBe(110); expect(r.allocatedAmount).toBe(55000); expect(r.remaining).toBe(-5000);
  });
  it("rejects a total budget of 0", () => {
    expect(() => projectBudgetAllocation({ totalBudget: 0, designFeePercent: 10 })).toThrow("Total budget must be more than 0.");
  });
  it("rejects any percentage above 100", () => {
    expect(() => projectBudgetAllocation({ totalBudget: 1000, designFeePercent: 101 })).toThrow("Design fee percentage cannot be more than 100.");
    expect(() => projectBudgetAllocation({ totalBudget: 1000, furniturePercent: 150 })).toThrow("Furniture percentage cannot be more than 100.");
    expect(() => projectBudgetAllocation({ totalBudget: 1000, constructionPercent: 100.5 })).toThrow("Construction percentage cannot be more than 100.");
    expect(() => projectBudgetAllocation({ totalBudget: 1000, contingencyPercent: 200 })).toThrow("Contingency percentage cannot be more than 100.");
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => projectBudgetAllocation({ totalBudget: -1 })).toThrow(/0 or more/);
    expect(() => projectBudgetAllocation({ totalBudget: 1000, furniturePercent: NaN })).toThrow(/0 or more/);
    expect(() => projectBudgetAllocation({ totalBudget: 1000, contingencyPercent: -2 })).toThrow(/0 or more/);
    expect(() => projectBudgetAllocation({})).toThrow(/0 or more/);
  });
});
