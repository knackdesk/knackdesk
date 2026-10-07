import { describe, it, expect } from "vitest";
import { caregiverTurnoverCost } from "../public/calc.js";
describe("caregiverTurnoverCost", () => {
  it("turns leavers, hiring, onboarding and unfilled hours into a yearly turnover cost", () => {
    const r = caregiverTurnoverCost({ caregivers: 40, leaversPerYear: 24, recruitingCostPerHire: 600, onboardingHours: 12, trainerCostPerHour: 30, unfilledHoursPerLeaver: 40, marginPerBillableHour: 9 });
    expect(r.turnoverPercent).toBe(60); expect(r.costPerLeaver).toBe(1320); expect(r.annualTurnoverCost).toBe(31680);
    expect(r.costPerCaregiver).toBe(792); expect(r.savingIfTurnoverHalved).toBe(15840);
  });
  it("assumes no recruiting, onboarding or unfilled-hour costs by default", () => {
    const r = caregiverTurnoverCost({ caregivers: 10, leaversPerYear: 3 });
    expect(r.turnoverPercent).toBe(30); expect(r.costPerLeaver).toBe(0); expect(r.annualTurnoverCost).toBe(0);
    expect(r.costPerCaregiver).toBe(0); expect(r.savingIfTurnoverHalved).toBe(0);
  });
  it("returns zero cost when nobody leaves", () => {
    const r = caregiverTurnoverCost({ caregivers: 10, leaversPerYear: 0, recruitingCostPerHire: 500 });
    expect(r.turnoverPercent).toBe(0); expect(r.costPerLeaver).toBe(500); expect(r.annualTurnoverCost).toBe(0);
  });
  it("rejects 0 caregivers", () => {
    expect(() => caregiverTurnoverCost({ caregivers: 0, leaversPerYear: 2 })).toThrow(/more than 0/);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => caregiverTurnoverCost({ caregivers: 10, leaversPerYear: -1 })).toThrow(/0 or more/);
    expect(() => caregiverTurnoverCost({ caregivers: 10, leaversPerYear: 2, recruitingCostPerHire: NaN })).toThrow(/0 or more/);
    expect(() => caregiverTurnoverCost({})).toThrow(/0 or more/);
  });
});
