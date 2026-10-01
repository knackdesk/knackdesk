import { describe, it, expect } from "vitest";
import { reorderPoint } from "../public/calc.js";

describe("reorder point", () => {
  it("uses entered safety stock", () => {
    const r = reorderPoint({ avgDailySales: 10, avgLeadTimeDays: 7, safetyStock: 20, coverDays: 30 });
    expect(r.safetyStock).toBe(20);
    expect(r.reorderPoint).toBe(90);
    expect(r.orderQuantity).toBe(300);
  });
  it("derives safety stock from maximum sales and lead time", () => {
    const r = reorderPoint({ avgDailySales: 10, avgLeadTimeDays: 7, maxDailySales: 15, maxLeadTimeDays: 10, coverDays: 30 });
    expect(r.safetyStock).toBe(80);
    expect(r.reorderPoint).toBe(150);
  });
  it("rejects max values below averages", () => {
    expect(() => reorderPoint({ avgDailySales: 10, avgLeadTimeDays: 7, maxDailySales: 5, maxLeadTimeDays: 10, coverDays: 30 })).toThrow(/maximum/i);
  });
});
