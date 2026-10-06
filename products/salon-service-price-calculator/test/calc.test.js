import { describe, it, expect } from "vitest";
import { salonServicePrice } from "../public/calc.js";
describe("salonServicePrice", () => {
  it("turns overhead, income goal, hours, minutes, product and margin into a service price", () => {
    const r = salonServicePrice({ monthlyOverhead: 2400, monthlyIncomeGoal: 4000, billableHoursPerMonth: 120, serviceMinutes: 60, productCost: 8, marginPercent: 20 });
    expect(r.targetHourlyRate).toBe(53.33); expect(r.timeCost).toBe(53.33); expect(r.floorPrice).toBe(61.33); expect(r.price).toBe(73.6);
  });
  it("assumes no product cost and no margin by default", () => {
    const r = salonServicePrice({ monthlyOverhead: 1000, monthlyIncomeGoal: 2000, billableHoursPerMonth: 100, serviceMinutes: 30 });
    expect(r.targetHourlyRate).toBe(30); expect(r.timeCost).toBe(15); expect(r.floorPrice).toBe(15); expect(r.price).toBe(15);
  });
  it("rejects zero billable hours", () => {
    expect(() => salonServicePrice({ monthlyOverhead: 2400, monthlyIncomeGoal: 4000, billableHoursPerMonth: 0, serviceMinutes: 60 })).toThrow(/billable hours/i);
  });
  it("rejects zero service minutes", () => {
    expect(() => salonServicePrice({ monthlyOverhead: 2400, monthlyIncomeGoal: 4000, billableHoursPerMonth: 120, serviceMinutes: 0 })).toThrow(/service minutes/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => salonServicePrice({ monthlyOverhead: -1, monthlyIncomeGoal: 4000, billableHoursPerMonth: 120, serviceMinutes: 60 })).toThrow(/0 or more/);
    expect(() => salonServicePrice({ monthlyOverhead: 2400, monthlyIncomeGoal: NaN, billableHoursPerMonth: 120, serviceMinutes: 60 })).toThrow(/0 or more/);
    expect(() => salonServicePrice({ monthlyOverhead: 2400, monthlyIncomeGoal: 4000, billableHoursPerMonth: 120, serviceMinutes: 60, marginPercent: -5 })).toThrow(/0 or more/);
  });
});
