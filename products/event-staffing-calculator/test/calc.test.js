import { describe, it, expect } from "vitest";
import { eventStaffing } from "../public/calc.js";
const base = { guests: 120, guestsPerServer: 25, eventHours: 5, setupHours: 2, minimumHours: 4, hourlyRate: 22 };
describe("eventStaffing", () => {
  it("finds servers, paid hours, labour cost and cost per guest", () => {
    const r = eventStaffing(base);
    expect(r.servers).toBe(5); expect(r.hoursPerServer).toBe(7); expect(r.totalHours).toBe(35);
    expect(r.laborCost).toBe(770); expect(r.costPerGuest).toBe(6.42);
  });
  it("pays the minimum call when the shift is shorter", () => {
    expect(eventStaffing({ ...base, eventHours: 2, setupHours: 0 }).hoursPerServer).toBe(4);
  });
  it("rejects zero guests per server", () => {
    expect(() => eventStaffing({ ...base, guestsPerServer: 0 })).toThrow(/per server/i);
  });
  it("rejects zero guests", () => {
    expect(() => eventStaffing({ ...base, guests: 0 })).toThrow(/guests/i);
  });
  it("rejects a negative rate", () => {
    expect(() => eventStaffing({ ...base, hourlyRate: -1 })).toThrow(/0 or more/);
  });
});
