import { describe, it, expect } from "vitest";
import { revenueGoal } from "../public/calc.js";

describe("revenue goal", () => {
  it("turns a goal into projects, clients and proposals per month", () => {
    const r = revenueGoal({ annualGoal: 120000, avgProjectValue: 5000, projectsPerClient: 2, winRatePercent: 25 });
    expect(r.projectsPerYear).toBe(24);
    expect(r.projectsPerMonth).toBe(2);
    expect(r.clientsPerYear).toBe(12);
    expect(r.proposalsPerYear).toBe(48);
    expect(r.proposalsPerMonth).toBe(4);
  });
  it("rounds projects and proposals up to whole numbers", () => {
    const r = revenueGoal({ annualGoal: 100000, avgProjectValue: 3000, projectsPerClient: 1, winRatePercent: 30 });
    expect(r.projectsPerYear).toBe(34);
    expect(r.proposalsPerYear).toBe(114);
  });
  it("rejects zero project value and win rate", () => {
    expect(() => revenueGoal({ annualGoal: 1, avgProjectValue: 0, projectsPerClient: 1, winRatePercent: 10 })).toThrow(/project value/i);
    expect(() => revenueGoal({ annualGoal: 1, avgProjectValue: 10, projectsPerClient: 1, winRatePercent: 0 })).toThrow(/win rate/i);
  });
});
