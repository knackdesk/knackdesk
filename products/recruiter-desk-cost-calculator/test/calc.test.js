import { describe, it, expect } from "vitest";
import { recruiterDeskCost } from "../public/calc.js";
describe("recruiterDeskCost", () => {
  it("turns salary, benefits, tools, overhead, placements and fee into desk cost, cost per placement, profit and break-even", () => {
    const r = recruiterDeskCost({ recruiterSalary: 55000, benefitsPercent: 20, toolsAndJobBoardsAnnual: 9000, overheadAllocationAnnual: 18000, placementsPerYear: 18, averageNetFee: 12000 });
    expect(r.loadedSalary).toBe(66000); expect(r.totalDeskCost).toBe(93000); expect(r.costPerPlacement).toBe(5166.67); expect(r.revenue).toBe(216000);
    expect(r.deskProfit).toBe(123000); expect(r.breakEvenPlacements).toBe(7.75); expect(r.revenuePerCostUnit).toBe(2.32);
  });
  it("assumes no benefits, tools, overhead or fee by default and returns null break-even placements", () => {
    const r = recruiterDeskCost({ recruiterSalary: 40000, placementsPerYear: 10 });
    expect(r.loadedSalary).toBe(40000); expect(r.totalDeskCost).toBe(40000); expect(r.costPerPlacement).toBe(4000); expect(r.revenue).toBe(0);
    expect(r.deskProfit).toBe(-40000); expect(r.breakEvenPlacements).toBeNull(); expect(r.revenuePerCostUnit).toBe(0);
  });
  it("returns a revenue per cost unit of 0 when the desk costs nothing", () => {
    const r = recruiterDeskCost({ recruiterSalary: 0, placementsPerYear: 5, averageNetFee: 1000 });
    expect(r.totalDeskCost).toBe(0); expect(r.revenuePerCostUnit).toBe(0); expect(r.breakEvenPlacements).toBe(0);
  });
  it("returns a negative desk profit when the desk costs more than it bills", () => {
    const r = recruiterDeskCost({ recruiterSalary: 55000, benefitsPercent: 20, toolsAndJobBoardsAnnual: 9000, overheadAllocationAnnual: 18000, placementsPerYear: 5, averageNetFee: 12000 });
    expect(r.deskProfit).toBe(-33000); expect(r.revenuePerCostUnit).toBe(0.65);
  });
  it("rejects placements per year of 0", () => {
    expect(() => recruiterDeskCost({ recruiterSalary: 55000, placementsPerYear: 0 })).toThrow(/more than 0/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => recruiterDeskCost({ recruiterSalary: -1, placementsPerYear: 10 })).toThrow(/0 or more/);
    expect(() => recruiterDeskCost({ recruiterSalary: 55000, benefitsPercent: NaN, placementsPerYear: 10 })).toThrow(/0 or more/);
    expect(() => recruiterDeskCost({ recruiterSalary: 55000 })).toThrow(/0 or more/);
  });
});
