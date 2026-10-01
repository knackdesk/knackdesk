import { describe, it, expect } from "vitest";
import { callOut } from "../public/calc.js";
describe("callOut", () => {
  it("adds extra time in billing increments and parts at markup to the call-out fee", () => {
    const r = callOut({ callOutFee: 80, includedMinutes: 60, hourlyRate: 60, minutesOnSite: 100, incrementMinutes: 30, partsCost: 45, partsMarkupPercent: 50 });
    expect(r.extraMinutes).toBe(40); expect(r.billedExtraMinutes).toBe(60); expect(r.laborCharge).toBe(60); expect(r.partsPrice).toBe(67.5); expect(r.total).toBe(207.5);
  });
  it("charges only the fee when the visit fits the included time", () => {
    const r = callOut({ callOutFee: 80, includedMinutes: 60, hourlyRate: 60, minutesOnSite: 45, incrementMinutes: 15, partsCost: 0, partsMarkupPercent: 0 });
    expect(r.billedExtraMinutes).toBe(0); expect(r.total).toBe(80);
  });
  it("rejects a zero billing increment", () => {
    expect(() => callOut({ callOutFee: 80, includedMinutes: 60, hourlyRate: 60, minutesOnSite: 90, incrementMinutes: 0, partsCost: 0, partsMarkupPercent: 0 })).toThrow(/increment/i);
  });
});
