import { describe, it, expect } from "vitest";
import { parseFrontmatter, validateProduct } from "./frontmatter.js";

const doc = `---
slug: budget-kit
name: "Budget Kit"
lane: digital
price_cents: 900
status: live
tagline: A calm monthly budget
description: Spreadsheet plus guide.
---
# Plan
body here`;

describe("parseFrontmatter", () => {
  it("parses typed values and body", () => {
    const { data, body } = parseFrontmatter(doc);
    expect(data.slug).toBe("budget-kit");
    expect(data.name).toBe("Budget Kit");
    expect(data.price_cents).toBe(900);
    expect(body.trim()).toBe("# Plan\nbody here");
  });
  it("returns empty data when no front-matter", () => {
    expect(parseFrontmatter("just text").data).toEqual({});
  });
});

describe("validateProduct", () => {
  const good = parseFrontmatter(doc).data;
  it("accepts a valid product", () => {
    expect(validateProduct(good)).toBe(good);
  });
  it("rejects a dollar-string price", () => {
    expect(() => validateProduct({ ...good, price_cents: "9.99" })).toThrow(/price_cents/);
  });
  it("rejects a fractional price", () => {
    expect(() => validateProduct({ ...good, price_cents: 9.99 })).toThrow(/price_cents/);
  });
  it("rejects an unknown lane", () => {
    expect(() => validateProduct({ ...good, lane: "saas" })).toThrow(/lane/);
  });
  it("rejects a non-kebab slug", () => {
    expect(() => validateProduct({ ...good, slug: "Budget Kit" })).toThrow(/slug/);
  });
  it("does not require price for tools", () => {
    const { price_cents, ...tool } = { ...good, lane: "tool", category: "pricing" };
    expect(validateProduct(tool)).toBe(tool);
  });
  it("requires a known category for tools", () => {
    const { price_cents, ...tool } = { ...good, lane: "tool" };
    expect(() => validateProduct(tool)).toThrow(/category/);
    expect(() => validateProduct({ ...tool, category: "misc" })).toThrow(/category/);
    for (const category of ["invoicing", "pricing", "planning", "time"]) {
      expect(validateProduct({ ...tool, category }).category).toBe(category);
    }
  });
  it("does not require a category for digital products", () => {
    expect(validateProduct(good)).toBe(good);
  });
  it("accepts optional reviewed and headline fields", () => {
    const tool = { ...good, lane: "tool", category: "time", reviewed: "2026-10-01", headline: "Short headline" };
    expect(validateProduct(tool)).toBe(tool);
  });
  it("rejects a malformed reviewed date", () => {
    expect(() => validateProduct({ ...good, reviewed: "1 Oct 2026" })).toThrow(/reviewed/);
    expect(() => validateProduct({ ...good, reviewed: "2026-13-01" })).toThrow(/reviewed/);
  });
  it("rejects an empty or overlong headline", () => {
    expect(() => validateProduct({ ...good, headline: "" })).toThrow(/headline/);
    expect(() => validateProduct({ ...good, headline: "x".repeat(61) })).toThrow(/headline/);
  });
  it("parses a reviewed date as a string", () => {
    expect(parseFrontmatter("---\nreviewed: 2026-10-01\n---\n").data.reviewed).toBe("2026-10-01");
  });
});
