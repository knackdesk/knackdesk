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
  it("keeps dollar signs in taglines and skips live digital products that have no polar_url yet", async () => {
    writeFileSync(join(root, "products", "conv", "PLAN.md"), `---
slug: conv
name: Converter
lane: tool
status: live
tagline: Save $$ now and $& more
description: d
---`);
    mkdirSync(join(root, "products", "kit"), { recursive: true });
    writeFileSync(join(root, "products", "kit", "PLAN.md"), `---
slug: kit
name: The Kit
lane: digital
price_cents: 900
status: live
tagline: kit tagline
description: d
---`);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const index = readFileSync(join(out, "index.html"), "utf8");
    expect(index).toContain("Save $$ now and $&amp; more");
    expect(index).not.toContain("kit tagline");
    expect(index).not.toContain('href="#"');
  });
  it("writes sitemap.xml listing site pages and live products, and a robots.txt pointing to it", async () => {
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const sm = readFileSync(join(out, "sitemap.xml"), "utf8");
    expect(sm).toContain("<loc>https://knackdesk.com/</loc>");
    expect(sm).toContain("<loc>https://knackdesk.com/about/</loc>");
    expect(sm).toContain("<loc>https://knackdesk.com/conv/</loc>");
    expect(readFileSync(join(out, "robots.txt"), "utf8")).toContain("Sitemap: https://knackdesk.com/sitemap.xml");
  });
  it("writes ads.txt only when an AdSense id is configured", async () => {
    await buildSite({ rootDir: root, outDir: out, adsenseId: "ca-pub-123" });
    expect(readFileSync(join(out, "ads.txt"), "utf8").trim()).toBe("google.com, pub-123, DIRECT, f08c47fec0942fa0");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    expect(existsSync(join(out, "ads.txt"))).toBe(false);
  });
  it("wraps a tool page that declares title meta in the site layout, keeping other public files verbatim", async () => {
    mkdirSync(join(root, "products", "wrap", "public"), { recursive: true });
    writeFileSync(join(root, "products", "wrap", "public", "index.html"), "<!-- title: Wrap Tool -->\n<!-- description: wraps -->\n<h1>Wrap</h1>");
    writeFileSync(join(root, "products", "wrap", "public", "calc.js"), "export const x = 1;");
    writeFileSync(join(root, "products", "wrap", "PLAN.md"), `---
slug: wrap
name: Wrap Tool
lane: tool
status: live
tagline: wraps
description: d
---`);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "ca-pub-9" });
    const page = readFileSync(join(out, "wrap", "index.html"), "utf8");
    expect(page).toContain("<title>Wrap Tool · Knackdesk</title>");
    expect(page).toContain('<link rel="canonical" href="https://knackdesk.com/wrap/">');
    expect(page).toContain("client=ca-pub-9");
    expect(page).toContain("<h1>Wrap</h1>");
    expect(readFileSync(join(out, "wrap", "calc.js"), "utf8")).toBe("export const x = 1;");
    expect(readFileSync(join(out, "conv", "index.html"), "utf8")).toBe("<h1>conv</h1>");
  });
});
