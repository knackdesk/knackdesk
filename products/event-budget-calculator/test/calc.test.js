import { describe, it, expect } from "vitest";
import { eventBudget } from "../public/calc.js";
const lines = [
  { name: "Venue", amount: 3000 }, { name: "Catering", amount: 4000 }, { name: "Drinks", amount: 1200 },
  { name: "Decor", amount: 800 }, { name: "Entertainment", amount: 600 }, { name: "Other", amount: 300 },
];
describe("eventBudget", () => {
  it("totals lines, cost per guest, remaining budget and shares", () => {
    const r = eventBudget({ budget: 10000, guests: 80, lines });
    expect(r.total).toBe(9900); expect(r.perGuest).toBe(123.75); expect(r.remaining).toBe(100);
    const catering = r.lines.find((l) => l.name === "Catering");
    const venue = r.lines.find((l) => l.name === "Venue");
    expect(catering.share).toBe(40.4); expect(venue.perGuest).toBe(37.5);
  });
  it("shows a negative remaining amount when over budget", () => {
    expect(eventBudget({ budget: 9000, guests: 80, lines }).remaining).toBe(-900);
  });
  it("does not mutate the input lines", () => {
    const copy = lines.map((l) => ({ ...l }));
    eventBudget({ budget: 10000, guests: 80, lines });
    expect(lines).toEqual(copy);
  });
  it("rejects zero guests", () => {
    expect(() => eventBudget({ budget: 10000, guests: 0, lines })).toThrow(/guests/i);
  });
  it("rejects an empty list of lines", () => {
    expect(() => eventBudget({ budget: 10000, guests: 80, lines: [] })).toThrow(/line/i);
  });
  it("rejects a negative line amount", () => {
    expect(() => eventBudget({ budget: 10000, guests: 80, lines: [{ name: "Venue", amount: -5 }] })).toThrow();
  });
});
