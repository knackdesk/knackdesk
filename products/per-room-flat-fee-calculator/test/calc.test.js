import { describe, it, expect } from "vitest";
import { perRoomFlatFee } from "../public/calc.js";
describe("perRoomFlatFee", () => {
  it("turns rooms, hours, uplift and site visits into a flat fee", () => {
    const r = perRoomFlatFee({ rooms: 3, hoursPerRoom: 12, hourlyRate: 110, complexityUpliftPercent: 10, siteVisitHours: 4, minimumFee: 2500 });
    expect(r.totalHours).toBe(43.6); expect(r.computedFee).toBe(4796); expect(r.flatFee).toBe(4796);
    expect(r.minimumApplied).toBe(false); expect(r.feePerRoom).toBe(1598.67);
  });
  it("applies the minimum fee when the computed fee is lower", () => {
    const r = perRoomFlatFee({ rooms: 1, hoursPerRoom: 8, hourlyRate: 110, complexityUpliftPercent: 0, siteVisitHours: 0, minimumFee: 1500 });
    expect(r.computedFee).toBe(880); expect(r.flatFee).toBe(1500); expect(r.minimumApplied).toBe(true); expect(r.feePerRoom).toBe(1500);
  });
  it("assumes no uplift, site visits or minimum by default", () => {
    const r = perRoomFlatFee({ rooms: 2, hoursPerRoom: 10, hourlyRate: 100 });
    expect(r.totalHours).toBe(20); expect(r.computedFee).toBe(2000); expect(r.flatFee).toBe(2000); expect(r.minimumApplied).toBe(false); expect(r.feePerRoom).toBe(1000);
  });
  it("rejects 0 rooms", () => {
    expect(() => perRoomFlatFee({ rooms: 0, hoursPerRoom: 10, hourlyRate: 100 })).toThrow("Rooms must be more than 0.");
  });
  it("rejects an hourly rate of 0", () => {
    expect(() => perRoomFlatFee({ rooms: 2, hoursPerRoom: 10, hourlyRate: 0 })).toThrow("Hourly rate must be more than 0.");
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => perRoomFlatFee({ rooms: 2, hoursPerRoom: -1, hourlyRate: 100 })).toThrow(/0 or more/);
    expect(() => perRoomFlatFee({ rooms: 2, hoursPerRoom: 10, hourlyRate: NaN })).toThrow(/0 or more/);
    expect(() => perRoomFlatFee({ rooms: 2, hoursPerRoom: 10, hourlyRate: 100, minimumFee: -1 })).toThrow(/0 or more/);
    expect(() => perRoomFlatFee({})).toThrow(/0 or more/);
  });
});
