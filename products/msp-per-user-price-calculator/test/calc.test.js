import { describe, it, expect } from "vitest";
import { mspPerUserPrice } from "../public/calc.js";
describe("mspPerUserPrice", () => {
  it("turns users, tool costs, support hours, loaded cost and margin into a per-user price", () => {
    const r = mspPerUserPrice({ users: 50, toolCostPerUserMonthly: 12, fixedToolCostMonthly: 400, supportHoursPerUserMonthly: 0.75, loadedHourlyCost: 60, marginPercent: 30 });
    expect(r.toolCostPerUser).toBe(20); expect(r.labourCostPerUser).toBe(45); expect(r.costPerUser).toBe(65);
    expect(r.pricePerUser).toBe(92.86); expect(r.monthlyRevenue).toBe(4642.86); expect(r.monthlyProfit).toBe(1392.86);
  });
  it("assumes no tool costs and no margin by default", () => {
    const r = mspPerUserPrice({ users: 10, supportHoursPerUserMonthly: 1, loadedHourlyCost: 50 });
    expect(r.toolCostPerUser).toBe(0); expect(r.labourCostPerUser).toBe(50); expect(r.costPerUser).toBe(50);
    expect(r.pricePerUser).toBe(50); expect(r.monthlyRevenue).toBe(500); expect(r.monthlyProfit).toBe(0);
  });
  it("spreads fixed tool costs across users", () => {
    expect(mspPerUserPrice({ users: 8, fixedToolCostMonthly: 100, supportHoursPerUserMonthly: 0, loadedHourlyCost: 0 }).toolCostPerUser).toBe(12.5);
  });
  it("rejects zero users", () => {
    expect(() => mspPerUserPrice({ users: 0, supportHoursPerUserMonthly: 1, loadedHourlyCost: 50 })).toThrow(/users/i);
  });
  it("rejects a margin of 100 or more", () => {
    expect(() => mspPerUserPrice({ users: 10, supportHoursPerUserMonthly: 1, loadedHourlyCost: 50, marginPercent: 100 })).toThrow(/margin/i);
    expect(() => mspPerUserPrice({ users: 10, supportHoursPerUserMonthly: 1, loadedHourlyCost: 50, marginPercent: 120 })).toThrow(/margin/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => mspPerUserPrice({ users: 10, supportHoursPerUserMonthly: -1, loadedHourlyCost: 50 })).toThrow(/0 or more/);
    expect(() => mspPerUserPrice({ users: 10, supportHoursPerUserMonthly: 1, loadedHourlyCost: NaN })).toThrow(/0 or more/);
    expect(() => mspPerUserPrice({ users: 10, loadedHourlyCost: 50 })).toThrow(/0 or more/);
  });
});
