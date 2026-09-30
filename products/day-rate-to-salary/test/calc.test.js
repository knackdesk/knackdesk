import { describe, it, expect } from "vitest";
import { dayRateToSalary, salaryToDayRate } from "../public/calc.js";

describe("day rate <-> salary", () => {
  it("500/day, 220 billable days, 25% contractor overhead: equivalent salary 88000", () => {
    const r = dayRateToSalary({ dayRate: 500, billableDays: 220, overheadPercent: 25 });
    expect(r.contractorRevenue).toBe(110000);
    expect(r.equivalentSalary).toBe(88000);
  });
  it("88000 salary, 220 days, 25% overhead: needs 500/day", () => {
    const r = salaryToDayRate({ salary: 88000, billableDays: 220, overheadPercent: 25 });
    expect(r.dayRate).toBe(500);
    expect(r.hourlyRate).toBe(62.5);
  });
  it("rejects zero billable days and overhead of 100 or more", () => {
    expect(() => dayRateToSalary({ dayRate: 500, billableDays: 0, overheadPercent: 25 })).toThrow(/days/i);
    expect(() => salaryToDayRate({ salary: 1, billableDays: 10, overheadPercent: 100 })).toThrow(/overhead/i);
  });
});

describe("day rate (review fixes)", () => {
  it("rejects zero hours per day", () => {
    expect(() => dayRateToSalary({ dayRate: 500, billableDays: 220, overheadPercent: 25, hoursPerDay: 0 })).toThrow(/hours/i);
  });
});
