import { describe, it, expect } from "vitest";
import { vacancyRate } from "../public/calc.js";
describe("vacancyRate", () => {
  it("computes vacancy and occupancy rates and lost rent", () => {
    const r = vacancyRate({ units: 20, vacantUnits: 2, averageMonthlyRent: 1000 });
    expect(r.vacancyPercent).toBe(10); expect(r.occupancyPercent).toBe(90); expect(r.lostRentPerMonth).toBe(2000); expect(r.lostRentPerYear).toBe(24000); expect(r.collectedPerMonth).toBe(18000);
  });
  it("rejects more vacant units than units", () => {
    expect(() => vacancyRate({ units: 5, vacantUnits: 6, averageMonthlyRent: 1000 })).toThrow(/vacant/i);
  });
  it("rejects zero units", () => {
    expect(() => vacancyRate({ units: 0, vacantUnits: 0, averageMonthlyRent: 1000 })).toThrow(/units/i);
  });
});
