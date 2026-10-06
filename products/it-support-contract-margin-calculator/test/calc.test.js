import { describe, it, expect } from "vitest";
import { itContractMargin } from "../public/calc.js";
describe("itContractMargin", () => {
  it("turns fee, seats, tools, labour and other costs into margin, per-seat figures and break-even hours", () => {
    const r = itContractMargin({ monthlyFee: 4500, seats: 50, toolCostsMonthly: 1000, labourHoursMonthly: 35, loadedHourlyCost: 60, otherCostsMonthly: 200 });
    expect(r.labourCost).toBe(2100); expect(r.totalCost).toBe(3300); expect(r.grossProfit).toBe(1200); expect(r.marginPercent).toBe(26.67);
    expect(r.costPerSeat).toBe(66); expect(r.feePerSeat).toBe(90); expect(r.breakEvenHours).toBe(55);
  });
  it("assumes no seats, tools or other costs by default and returns null per-seat figures", () => {
    const r = itContractMargin({ monthlyFee: 1000, labourHoursMonthly: 10, loadedHourlyCost: 50 });
    expect(r.totalCost).toBe(500); expect(r.grossProfit).toBe(500); expect(r.marginPercent).toBe(50);
    expect(r.costPerSeat).toBeNull(); expect(r.feePerSeat).toBeNull(); expect(r.breakEvenHours).toBe(20);
  });
  it("returns a negative gross profit and margin when costs exceed the fee", () => {
    const r = itContractMargin({ monthlyFee: 3000, seats: 50, toolCostsMonthly: 1000, labourHoursMonthly: 35, loadedHourlyCost: 60, otherCostsMonthly: 200 });
    expect(r.grossProfit).toBe(-300); expect(r.marginPercent).toBe(-10); expect(r.breakEvenHours).toBe(30);
  });
  it("returns a margin of 0 when the fee is 0", () => {
    expect(itContractMargin({ monthlyFee: 0, labourHoursMonthly: 5, loadedHourlyCost: 50 }).marginPercent).toBe(0);
  });
  it("returns null break-even hours when the hourly cost is 0", () => {
    expect(itContractMargin({ monthlyFee: 1000, labourHoursMonthly: 5, loadedHourlyCost: 0 }).breakEvenHours).toBeNull();
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => itContractMargin({ monthlyFee: -1, labourHoursMonthly: 5, loadedHourlyCost: 50 })).toThrow(/0 or more/);
    expect(() => itContractMargin({ monthlyFee: 1000, seats: NaN, labourHoursMonthly: 5, loadedHourlyCost: 50 })).toThrow(/0 or more/);
    expect(() => itContractMargin({ monthlyFee: 1000, loadedHourlyCost: 50 })).toThrow(/0 or more/);
  });
});
