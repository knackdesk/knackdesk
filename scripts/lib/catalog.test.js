import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadCatalog } from "./catalog.js";

const plan = (slug, status) => `---
slug: ${slug}
name: ${slug} name
lane: tool
status: ${status}
tagline: t
description: d
---
body`;

let root;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "kd-"));
  mkdirSync(join(root, "products", "alpha"), { recursive: true });
  mkdirSync(join(root, "products", "beta"), { recursive: true });
  mkdirSync(join(root, "products", "noplan"), { recursive: true });
  writeFileSync(join(root, "products", "alpha", "PLAN.md"), plan("alpha", "live"));
  writeFileSync(join(root, "products", "beta", "PLAN.md"), plan("beta", "draft"));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("loadCatalog", () => {
  it("returns only live products with PLAN.md, sorted by slug", async () => {
    const items = await loadCatalog(root);
    expect(items.map((i) => i.data.slug)).toEqual(["alpha"]);
    expect(items[0].dir).toBe(join(root, "products", "alpha"));
  });
  it("throws on invalid front-matter", async () => {
    writeFileSync(join(root, "products", "alpha", "PLAN.md"), plan("Bad Slug", "live"));
    await expect(loadCatalog(root)).rejects.toThrow(/slug/);
  });
});
