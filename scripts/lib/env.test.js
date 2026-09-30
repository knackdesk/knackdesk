import { describe, it, expect } from "vitest";
import { requireEnv } from "./env.js";

describe("requireEnv", () => {
  it("returns the requested values when all present", () => {
    const out = requireEnv(["A", "B"], { A: "1", B: "2", C: "3" });
    expect(out).toEqual({ A: "1", B: "2" });
  });
  it("throws listing every missing or empty name", () => {
    expect(() => requireEnv(["A", "B", "C"], { A: "1", B: "" })).toThrow("Missing env: B, C");
  });
});
