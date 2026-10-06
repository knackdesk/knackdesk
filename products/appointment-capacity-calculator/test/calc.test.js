import { describe, it, expect } from "vitest";
import { appointmentCapacity } from "../public/calc.js";
describe("appointmentCapacity", () => {
  it("turns hours, service time, buffer, utilization and ticket into appointments and revenue per week", () => {
    const r = appointmentCapacity({ hoursPerWeek: 40, serviceMinutes: 45, bufferMinutes: 15, utilizationPercent: 80, averageTicket: 65 });
    expect(r.slotMinutes).toBe(60); expect(r.maxAppointmentsPerWeek).toBe(40); expect(r.expectedAppointmentsPerWeek).toBe(32);
    expect(r.maxRevenuePerWeek).toBe(2600); expect(r.expectedRevenuePerWeek).toBe(2080);
  });
  it("assumes no buffer, full utilization and no ticket by default", () => {
    const r = appointmentCapacity({ hoursPerWeek: 10, serviceMinutes: 50 });
    expect(r.slotMinutes).toBe(50); expect(r.maxAppointmentsPerWeek).toBe(12); expect(r.expectedAppointmentsPerWeek).toBe(12); expect(r.expectedRevenuePerWeek).toBe(0);
  });
  it("counts only whole slots", () => {
    expect(appointmentCapacity({ hoursPerWeek: 2, serviceMinutes: 50 }).maxAppointmentsPerWeek).toBe(2);
  });
  it("rejects a slot of 0 minutes", () => {
    expect(() => appointmentCapacity({ hoursPerWeek: 40, serviceMinutes: 0, bufferMinutes: 0 })).toThrow(/minutes/i);
  });
  it("rejects utilization above 100", () => {
    expect(() => appointmentCapacity({ hoursPerWeek: 40, serviceMinutes: 45, utilizationPercent: 101 })).toThrow(/utilization/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => appointmentCapacity({ hoursPerWeek: -1, serviceMinutes: 45 })).toThrow(/0 or more/);
    expect(() => appointmentCapacity({ hoursPerWeek: 40, serviceMinutes: NaN })).toThrow(/0 or more/);
  });
});
