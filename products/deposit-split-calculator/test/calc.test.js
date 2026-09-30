import { describe, it, expect } from "vitest";
import { splitPayments } from "../public/calc.js";

describe("deposit split", () => {
  it("splits a deposit percent and equal milestones, cents balanced on the last one", () => {
    const r = splitPayments({ total: 1000, depositPercent: 30, milestones: 3, startDate: "2026-04-01", weeks: 6 });
    expect(r.deposit).toBe(300);
    expect(r.payments.map((p) => p.amount)).toEqual([300, 233.33, 233.33, 233.34]);
    expect(r.payments.reduce((s, p) => s + p.amount, 0)).toBeCloseTo(1000, 2);
    expect(r.payments[0].label).toBe("Deposit");
    expect(r.payments[0].due).toBe("2026-04-01");
    expect(r.payments[3].due).toBe("2026-05-13");
  });
  it("spaces milestones evenly across the project weeks", () => {
    const r = splitPayments({ total: 900, depositPercent: 0, milestones: 3, startDate: "2026-01-01", weeks: 3 });
    expect(r.payments.map((p) => p.due)).toEqual(["2026-01-08", "2026-01-15", "2026-01-22"]);
    expect(r.deposit).toBe(0);
  });
  it("rejects invalid input", () => {
    expect(() => splitPayments({ total: 0, depositPercent: 10, milestones: 1, startDate: "2026-01-01", weeks: 1 })).toThrow(/total/i);
    expect(() => splitPayments({ total: 100, depositPercent: 101, milestones: 1, startDate: "2026-01-01", weeks: 1 })).toThrow(/deposit/i);
    expect(() => splitPayments({ total: 100, depositPercent: 10, milestones: 0, startDate: "2026-01-01", weeks: 1 })).toThrow(/milestone/i);
  });
});
