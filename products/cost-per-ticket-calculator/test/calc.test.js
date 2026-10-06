import { describe, it, expect } from "vitest";
import { costPerTicket } from "../public/calc.js";
describe("costPerTicket", () => {
  it("turns tickets, technician, tool and overhead costs into cost per ticket and workload", () => {
    const r = costPerTicket({ ticketsPerMonth: 400, technicianCostMonthly: 9000, toolCostMonthly: 800, overheadMonthly: 1200, technicians: 3, averageMinutesPerTicket: 25 });
    expect(r.totalCost).toBe(11000); expect(r.costPerTicket).toBe(27.5); expect(r.labourCostPerTicket).toBe(22.5);
    expect(r.ticketsPerTechnician).toBe(133.33); expect(r.labourHoursOnTickets).toBe(166.67);
  });
  it("assumes no tools, overhead, technician count or minutes by default", () => {
    const r = costPerTicket({ ticketsPerMonth: 200, technicianCostMonthly: 5000 });
    expect(r.totalCost).toBe(5000); expect(r.costPerTicket).toBe(25); expect(r.labourCostPerTicket).toBe(25);
    expect(r.ticketsPerTechnician).toBeNull(); expect(r.labourHoursOnTickets).toBe(0);
  });
  it("rejects zero tickets", () => {
    expect(() => costPerTicket({ ticketsPerMonth: 0, technicianCostMonthly: 5000 })).toThrow(/tickets/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => costPerTicket({ ticketsPerMonth: 100, technicianCostMonthly: -5 })).toThrow(/0 or more/);
    expect(() => costPerTicket({ ticketsPerMonth: 100, technicianCostMonthly: 5000, technicians: NaN })).toThrow(/0 or more/);
    expect(() => costPerTicket({ ticketsPerMonth: 100 })).toThrow(/0 or more/);
  });
});
