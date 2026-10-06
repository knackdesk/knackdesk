import { describe, it, expect } from "vitest";
import { costPerImage } from "../public/calc.js";
describe("costPerImage", () => {
  it("spreads shoot and editing time over the images delivered", () => {
    const r = costPerImage({ shootHours: 6, editingHours: 10, hourlyRate: 60, imagesDelivered: 200, markupPercent: 100 });
    expect(r.totalHours).toBe(16); expect(r.totalCost).toBe(960); expect(r.costPerImage).toBe(4.8);
    expect(r.extraImagePrice).toBe(9.6); expect(r.minutesPerImage).toBe(4.8);
  });
  it("prices extra images at cost when there is no markup", () => {
    const r = costPerImage({ shootHours: 1, editingHours: 1, hourlyRate: 50, imagesDelivered: 20 });
    expect(r.extraImagePrice).toBe(5); expect(r.minutesPerImage).toBe(6);
  });
  it("rejects zero images", () => {
    expect(() => costPerImage({ shootHours: 6, editingHours: 10, hourlyRate: 60, imagesDelivered: 0 })).toThrow(/images/i);
  });
  it("rejects negative or non-numeric input", () => {
    expect(() => costPerImage({ shootHours: -1, editingHours: 10, hourlyRate: 60, imagesDelivered: 200 })).toThrow(/0 or more/);
    expect(() => costPerImage({ shootHours: 6, editingHours: NaN, hourlyRate: 60, imagesDelivered: 200 })).toThrow(/0 or more/);
  });
});
