import { describe, it, expect } from "vitest";
import { clientCapacity } from "../public/calc.js";
describe("clientCapacity", () => {
  it("turns hours, admin share, hours per client, current clients and fee into capacity and revenue", () => {
    const r = clientCapacity({ hoursPerMonth: 160, adminPercent: 25, hoursPerClient: 6, currentClients: 15, averageFee: 500 });
    expect(r.billableHours).toBe(120); expect(r.maxClients).toBe(20); expect(r.hoursUsed).toBe(90); expect(r.spareHours).toBe(30);
    expect(r.openSlots).toBe(5); expect(r.revenueAtCapacity).toBe(10000); expect(r.currentRevenue).toBe(7500);
  });
  it("assumes no admin time, no current clients and no fee by default", () => {
    const r = clientCapacity({ hoursPerMonth: 100, hoursPerClient: 7 });
    expect(r.billableHours).toBe(100); expect(r.maxClients).toBe(14); expect(r.openSlots).toBe(14); expect(r.revenueAtCapacity).toBe(0);
  });
  it("counts a client that exactly fills the hours despite floating point error", () => {
    expect(clientCapacity({ hoursPerMonth: 0.3, hoursPerClient: 0.1 }).maxClients).toBe(3);
  });
  it("returns negative spare hours and open slots when overbooked", () => {
    const r = clientCapacity({ hoursPerMonth: 160, adminPercent: 25, hoursPerClient: 6, currentClients: 22 });
    expect(r.spareHours).toBe(-12); expect(r.openSlots).toBe(-2);
  });
  it("rejects zero hours per client", () => {
    expect(() => clientCapacity({ hoursPerMonth: 160, hoursPerClient: 0 })).toThrow(/hours per client/i);
  });
  it("rejects an admin percentage above 100", () => {
    expect(() => clientCapacity({ hoursPerMonth: 160, adminPercent: 101, hoursPerClient: 6 })).toThrow(/admin/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => clientCapacity({ hoursPerMonth: -1, hoursPerClient: 6 })).toThrow(/0 or more/);
    expect(() => clientCapacity({ hoursPerMonth: 160, hoursPerClient: 6, currentClients: NaN })).toThrow(/0 or more/);
  });
});
