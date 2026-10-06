import { describe, it, expect } from "vitest";
import { blockHoursPrice } from "../public/calc.js";
describe("blockHoursPrice", () => {
  it("turns hours, rate, discount, expiry and expected unused hours into block price and effective rates", () => {
    const r = blockHoursPrice({ hoursInBlock: 20, hourlyRate: 120, discountPercent: 10, expiryMonths: 6, expectedUnusedPercent: 15 });
    expect(r.listPrice).toBe(2400); expect(r.blockPrice).toBe(2160); expect(r.effectiveRate).toBe(108);
    expect(r.expectedUsedHours).toBe(17); expect(r.effectiveRateOnUsedHours).toBe(127.06); expect(r.perMonth).toBe(360);
  });
  it("assumes no discount, no expiry and no unused hours by default", () => {
    const r = blockHoursPrice({ hoursInBlock: 10, hourlyRate: 100 });
    expect(r.listPrice).toBe(1000); expect(r.blockPrice).toBe(1000); expect(r.effectiveRate).toBe(100);
    expect(r.expectedUsedHours).toBe(10); expect(r.effectiveRateOnUsedHours).toBe(100); expect(r.perMonth).toBeNull();
  });
  it("returns a null rate on used hours when every hour is expected to go unused", () => {
    expect(blockHoursPrice({ hoursInBlock: 10, hourlyRate: 100, expectedUnusedPercent: 100 }).effectiveRateOnUsedHours).toBeNull();
  });
  it("rejects zero hours in the block", () => {
    expect(() => blockHoursPrice({ hoursInBlock: 0, hourlyRate: 100 })).toThrow(/hours in the block/i);
  });
  it("rejects a discount or unused share above 100", () => {
    expect(() => blockHoursPrice({ hoursInBlock: 10, hourlyRate: 100, discountPercent: 101 })).toThrow(/discount/i);
    expect(() => blockHoursPrice({ hoursInBlock: 10, hourlyRate: 100, expectedUnusedPercent: 101 })).toThrow(/unused/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => blockHoursPrice({ hoursInBlock: 10, hourlyRate: -1 })).toThrow(/0 or more/);
    expect(() => blockHoursPrice({ hoursInBlock: 10, hourlyRate: 100, expiryMonths: NaN })).toThrow(/0 or more/);
  });
});
