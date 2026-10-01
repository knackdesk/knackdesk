import { describe, it, expect } from "vitest";
import { turnover } from "../public/calc.js";

describe("inventory turnover", () => {
  it("computes turns and days on hand from COGS and average inventory", () => {
    const r = turnover({ cogs: 120000, averageInventory: 30000, periodDays: 365 });
    expect(r.turnover).toBe(4);
    expect(r.daysOnHand).toBe(91.25);
  });
  it("derives average inventory from opening and closing values", () => {
    const r = turnover({ cogs: 60000, openingInventory: 20000, closingInventory: 10000, periodDays: 365 });
    expect(r.averageInventory).toBe(15000);
    expect(r.turnover).toBe(4);
  });
  it("rejects zero inventory", () => {
    expect(() => turnover({ cogs: 100, averageInventory: 0, periodDays: 365 })).toThrow(/inventory/i);
  });
});
