import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite } from "./build-site.js";

let root, out;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "kd-"));
  out = join(root, "dist");
  cpSync(new URL("../site", import.meta.url), join(root, "site"), { recursive: true });
  cpSync(new URL("../shared", import.meta.url), join(root, "shared"), { recursive: true });
  mkdirSync(join(root, "products", "conv", "public"), { recursive: true });
  writeFileSync(join(root, "products", "conv", "public", "index.html"), "<h1>conv</h1>");
  writeFileSync(join(root, "products", "conv", "PLAN.md"), `---
slug: conv
name: Converter
lane: tool
status: live
tagline: converts
description: d
---`);
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("buildSite", () => {
  it("writes index, pages, product folders, CNAME and styles", async () => {
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const index = readFileSync(join(out, "index.html"), "utf8");
    expect(index).toContain('href="/conv/"');
    expect(index).toContain("<title>Small, useful tools and kits · Knackdesk</title>");
    expect(existsSync(join(out, "about", "index.html"))).toBe(true);
    expect(readFileSync(join(out, "conv", "index.html"), "utf8")).toBe("<h1>conv</h1>");
    expect(readFileSync(join(out, "CNAME"), "utf8").trim()).toBe("knackdesk.com");
    expect(existsSync(join(out, "styles.css"))).toBe(true);
  });
});
