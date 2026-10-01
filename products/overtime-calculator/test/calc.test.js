import { describe, it, expect } from "vitest";
import { overtime } from "../public/calc.js";

describe("overtime", () => {
  it("pays time and a half over the threshold", () => {
    const r = overtime({ hoursWorked: 48, thresholdHours: 40, hourlyRate: 20, multiplier: 1.5 });
    expect(r.regularPay).toBe(800);
    expect(r.overtimePay).toBe(240);
    expect(r.total).toBe(1040);
    expect(r.effectiveRate).toBe(21.67);
  });
  it("applies double time after a second threshold", () => {
    const r = overtime({ hoursWorked: 60, thresholdHours: 40, hourlyRate: 20, multiplier: 1.5, doubleTimeAfter: 50 });
    expect(r.overtimeHours).toBe(10);
    expect(r.overtimePay).toBe(300);
    expect(r.doubleHours).toBe(10);
    expect(r.doublePay).toBe(400);
    expect(r.total).toBe(1500);
  });
  it("has no overtime below the threshold", () => {
    const r = overtime({ hoursWorked: 35, hourlyRate: 20 });
    expect(r.overtimeHours).toBe(0);
    expect(r.overtimePay).toBe(0);
    expect(r.total).toBe(700);
  });
  it("rejects invalid inputs naming the field", () => {
    expect(() => overtime({ hoursWorked: 45, hourlyRate: 20, multiplier: 0.5 })).toThrow(/multiplier/i);
    expect(() => overtime({ hoursWorked: 200, hourlyRate: 20 })).toThrow(/hours/i);
    expect(() => overtime({ hoursWorked: 45, hourlyRate: -1 })).toThrow(/rate/i);
    expect(() => overtime({ hoursWorked: 45, hourlyRate: 20, doubleTimeAfter: 30 })).toThrow(/double/i);
  });
});
