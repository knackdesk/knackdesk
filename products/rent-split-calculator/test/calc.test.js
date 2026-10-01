import { describe, it, expect } from "vitest";
import { splitRent } from "../public/calc.js";

const shares = (r) => r.shares.map((s) => s.share);

describe("rent split", () => {
  it("splits equally", () => {
    const r = splitRent({ totalRent: 1500, people: [{ name: "A" }, { name: "B" }, { name: "C" }], method: "equal" });
    expect(shares(r)).toEqual([500, 500, 500]);
    expect(r.total).toBe(1500);
  });
  it("splits by weight", () => {
    const r = splitRent({ totalRent: 1500, people: [{ name: "A", weight: 10 }, { name: "B", weight: 20 }], method: "weighted" });
    expect(shares(r)).toEqual([500, 1000]);
    expect(r.shares.map((s) => s.percent)).toEqual([33.33, 66.67]);
  });
  it("puts the rounding remainder on the last share so the total is exact", () => {
    const r = splitRent({ totalRent: 1000, people: [{ weight: 1 }, { weight: 1 }, { weight: 1 }], method: "weighted" });
    expect(shares(r)).toEqual([333.33, 333.33, 333.34]);
    expect(r.total).toBe(1000);
  });
  it("names unnamed people Person N", () => {
    const r = splitRent({ totalRent: 100, people: [{ name: "" }, { name: "  " }], method: "equal" });
    expect(r.shares.map((s) => s.name)).toEqual(["Person 1", "Person 2"]);
  });
  it("rejects one person and more than six", () => {
    expect(() => splitRent({ totalRent: 1000, people: [{ name: "A" }], method: "equal" })).toThrow(/people/i);
    expect(() => splitRent({ totalRent: 1000, people: Array.from({ length: 7 }, () => ({})), method: "equal" })).toThrow(/people/i);
  });
  it("rejects a weight of zero in weighted mode", () => {
    expect(() => splitRent({ totalRent: 1000, people: [{ name: "A", weight: 0 }, { name: "B", weight: 1 }], method: "weighted" })).toThrow(/weight|room size|income/i);
  });
  it("rejects a total of zero and a bad method", () => {
    expect(() => splitRent({ totalRent: 0, people: [{}, {}], method: "equal" })).toThrow(/total rent/i);
    expect(() => splitRent({ totalRent: 100, people: [{}, {}], method: "random" })).toThrow(/method/i);
  });
});
