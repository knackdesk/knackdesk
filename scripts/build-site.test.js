import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite } from "./build-site.js";

const ldGraph = (html) => {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  expect(scripts).toHaveLength(1);
  return JSON.parse(scripts[0][1])["@graph"];
};
const types = (graph) => graph.map((n) => n["@type"]);
const KIT_PLAN = `---
polar_url: https://buy.polar.sh/abc
slug: kit
name: The Kit
lane: digital
price_cents: 1200
status: live
tagline: kit tagline
description: A whole kit.
---`;
const FEE_PAGE = `<!-- title: Late Fee Calculator -->
<!-- description: Work out a late fee. -->
<h1>Late Fee Calculator</h1>
<p>Enter the amount and days late.</p>
<p class="definition"><strong>In one sentence:</strong> A late fee is extra money charged on an overdue invoice.</p>
<p class="formula"><strong>Formula:</strong> fee = amount &times; rate &divide; 100 &times; days &divide; 30</p>
<h2>Frequently asked questions</h2>
<h3>Do I count the due date?</h3>
<p>No. Day one is the day <em>after</em> the due date.</p>
<h2>Related tools</h2>`;
function addFeeTool(root, extra = "reviewed: 2026-10-01\nheadline: Late Payment Fee Calculator: Flat Fee or Interest") {
  mkdirSync(join(root, "products", "fee", "public"), { recursive: true });
  writeFileSync(join(root, "products", "fee", "public", "index.html"), FEE_PAGE);
  writeFileSync(join(root, "products", "fee", "PLAN.md"), `---
slug: fee
name: Late Fee Calculator
lane: tool
category: invoicing
status: live
tagline: Late fees on overdue invoices
description: d
${extra}
---`);
}

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
category: time
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
category: time
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
  it("prefers kits in the page's category in the cross-sell block and falls back to all kits", async () => {
    for (const [slug, cat] of [["kitf", "pricing"], ["kitp", "property"]]) {
      mkdirSync(join(root, "products", slug), { recursive: true });
      writeFileSync(join(root, "products", slug, "PLAN.md"), `---
polar_url: https://buy.polar.sh/${slug}
slug: ${slug}
name: Kit ${cat}
lane: digital
category: ${cat}
price_cents: 1200
status: live
tagline: t
description: d
---`);
    }
    mkdirSync(join(root, "products", "ptool", "public"), { recursive: true });
    writeFileSync(join(root, "products", "ptool", "public", "index.html"), "<!-- title: P -->\n<!-- description: p -->\n<h1>P</h1>");
    writeFileSync(join(root, "products", "ptool", "PLAN.md"), `---
slug: ptool
name: P tool
lane: tool
category: property
status: live
tagline: t
description: d
---`);
    writeFileSync(join(root, "products", "conv", "public", "index.html"), "<!-- title: Conv -->\n<!-- description: c -->\n<h1>Conv</h1>");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const aside = (html) => html.split('<aside class="crosssell">')[1].split("</aside>")[0];
    const prop = aside(readFileSync(join(out, "ptool", "index.html"), "utf8"));
    expect(prop).toContain("Kit property");
    expect(prop).not.toContain("Kit pricing");
    const conv = aside(readFileSync(join(out, "conv", "index.html"), "utf8"));
    expect(conv).toContain("Kit pricing");
    expect(conv).toContain("Kit property");
  });
  it("caps the cross-sell at the three most relevant kits: page category listed first, then more specific kits", async () => {
    const kits = [["k1", "planning, pricing"], ["k2", "pricing"], ["k3", "invoicing, planning"], ["k4", "planning"], ["k5", "time, planning, pricing"]];
    for (const [slug, cat] of kits) {
      mkdirSync(join(root, "products", slug), { recursive: true });
      writeFileSync(join(root, "products", slug, "PLAN.md"), `---
polar_url: https://buy.polar.sh/${slug}
slug: ${slug}
name: Kit ${slug}
lane: digital
category: ${cat}
price_cents: 1200
status: live
tagline: t
description: d
---`);
    }
    mkdirSync(join(root, "products", "ptool", "public"), { recursive: true });
    writeFileSync(join(root, "products", "ptool", "public", "index.html"), "<!-- title: P -->\n<!-- description: p -->\n<h1>P</h1>");
    writeFileSync(join(root, "products", "ptool", "PLAN.md"), `---
slug: ptool
name: P tool
lane: tool
category: planning
status: live
tagline: t
description: d
---`);
    writeFileSync(join(root, "products", "conv", "public", "index.html"), "<!-- title: Conv -->\n<!-- description: c -->\n<h1>Conv</h1>");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const aside = (html) => html.split('<aside class="crosssell">')[1].split("</aside>")[0];
    const names = (a) => [...a.matchAll(/<strong>(Kit k\d)<\/strong>/g)].map((m) => m[1]);
    // planning page: k4 (planning only) and k1 (planning first, 2 cats) outrank k3 (planning second) and k5 (planning second, 3 cats); k2 excluded
    expect(names(aside(readFileSync(join(out, "ptool", "index.html"), "utf8")))).toEqual(["Kit k4", "Kit k1", "Kit k3"]);
    // a page whose category matches only one kit shows that kit alone: matches are never padded with unrelated kits
    expect(names(aside(readFileSync(join(out, "conv", "index.html"), "utf8")))).toEqual(["Kit k5"]);
    const footer = readFileSync(join(out, "ptool", "index.html"), "utf8").split("<h4>Kits</h4>")[1].split("</ul>")[0];
    expect((footer.match(/href="\/kits\/#/g) || []).length).toBeLessThanOrEqual(6);
  });
  it("renders guides from site/guides into /guides/<slug>/ with Article schema, byline, breadcrumb and a /guides/ index", async () => {
    addFeeTool(root);
    mkdirSync(join(root, "site", "guides"), { recursive: true });
    writeFileSync(join(root, "site", "guides", "price-a-project.html"), `<!-- title: How to Price a Project -->
<!-- description: A guide to pricing. -->
<!-- reviewed: 2026-10-02 -->
<!-- summary: From hourly rate to quote in five steps. -->
<h1>How to price a project</h1>
<p>Start with the <a href="/fee/">late fee calculator</a>.</p>
<h2>Step one</h2><p>Text.</p>`);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const guide = readFileSync(join(out, "guides", "price-a-project", "index.html"), "utf8");
    expect(guide).toContain("<title>How to Price a Project");
    expect(guide).toContain('class="byline"');
    expect(guide).toMatch(/"@type":\s*"Article"/);
    expect(guide).toMatch(/"datePublished":\s*"2026-10-02"/);
    expect(guide).toMatch(/"BreadcrumbList"[\s\S]*Guides/);
    expect(guide).toContain('href="/guides/"');
    const index = readFileSync(join(out, "guides", "index.html"), "utf8");
    expect(index).toContain('href="/guides/price-a-project/"');
    expect(index).toContain("From hourly rate to quote in five steps.");
    expect(readFileSync(join(out, "sitemap.xml"), "utf8")).toContain("<loc>https://knackdesk.com/guides/price-a-project/</loc>");
    expect(readFileSync(join(out, "sitemap.xml"), "utf8")).toContain("<loc>https://knackdesk.com/guides/</loc>");
    expect(readFileSync(join(out, "llms.txt"), "utf8")).toContain("https://knackdesk.com/guides/price-a-project/");
    expect(readFileSync(join(out, "index.html"), "utf8")).toContain('href="/guides/"');
  });
  it("orders kits on /kits/ by units sold in pipeline/LEDGER.md, then by name", async () => {
    for (const slug of ["kit-a", "kit-b", "kit-c"]) {
      mkdirSync(join(root, "products", slug), { recursive: true });
      writeFileSync(join(root, "products", slug, "PLAN.md"), KIT_PLAN.replace("slug: kit", `slug: ${slug}`).replace("name: The Kit", `name: Kit ${slug.slice(-1).toUpperCase()}`).replace("https://buy.polar.sh/abc", `https://buy.polar.sh/${slug}`));
    }
    mkdirSync(join(root, "pipeline"), { recursive: true });
    writeFileSync(join(root, "pipeline", "LEDGER.md"), `# Ledger\n\n| slug | lane | launched | url | price_usd | units | gross_usd | net_usd |\n|---|---|---|---|---|---|---|---|\n| kit-a | digital | 2026-10-01 | u | 12.00 | 0 | 0.00 | 0.00 |\n| kit-c | digital | 2026-10-01 | u | 12.00 | 5 | 60.00 | 50.00 |\n| kit-b | digital | 2026-10-01 | u | 12.00 | 2 | 24.00 | 20.00 |\n`);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const kits = readFileSync(join(out, "kits", "index.html"), "utf8");
    const order = [...kits.matchAll(/<article class="kit" id="(kit-[abc])"/g)].map((m) => m[1]);
    expect(order).toEqual(["kit-c", "kit-b", "kit-a"]);
  });
  it("writes a category hub page per category with the tools, breadcrumb schema and sitemap entry", async () => {
    addFeeTool(root);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const hub = readFileSync(join(out, "invoicing", "index.html"), "utf8");
    expect(hub).toContain("<h1>Invoicing");
    expect(hub).toContain('href="/fee/"');
    expect(hub).toContain('"CollectionPage"');
    expect(hub).toContain('"ItemList"');
    const tool = readFileSync(join(out, "fee", "index.html"), "utf8");
    expect(tool).toContain('class="crumbs"');
    expect(tool).toContain('href="/invoicing/"');
    expect(tool).toMatch(/"BreadcrumbList"[\s\S]*"Invoicing/);
    expect(readFileSync(join(out, "sitemap.xml"), "utf8")).toContain("<loc>https://knackdesk.com/invoicing/</loc>");
    expect(readFileSync(join(out, "llms.txt"), "utf8")).toContain("https://knackdesk.com/invoicing/");
    expect(readFileSync(join(out, "index.html"), "utf8")).toContain('href="/invoicing/"');
  });
  it("renders the megamenu with every tool on tool pages, hub pages and site pages", async () => {
    addFeeTool(root);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    for (const page of ["fee/index.html", "invoicing/index.html", "about/index.html", "index.html"]) {
      const html = readFileSync(join(out, page), "utf8");
      const header = html.split("</header>")[0];
      expect(header).toContain("<details");
      expect(header).toContain('href="/fee/"');
      expect(header).toContain('href="/conv/"');
    }
  });
  it("links the stylesheet with a content hash on every page", async () => {
    writeFileSync(join(root, "products", "conv", "public", "index.html"), "<!-- title: Conv -->\n<!-- description: c -->\n<h1>Conv</h1>");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const html = readFileSync(join(out, "index.html"), "utf8");
    expect(html).toMatch(/href="\/styles\.css\?v=[0-9a-f]{8,}"/);
    expect(readFileSync(join(out, "conv", "index.html"), "utf8")).toMatch(/styles\.css\?v=[0-9a-f]{8,}/);
  });
  it("shows a kit's cover and sheet screenshots on /kits/ and copies them into the site when assets/images exists", async () => {
    mkdirSync(join(root, "products", "kitimg", "assets", "images"), { recursive: true });
    writeFileSync(join(root, "products", "kitimg", "PLAN.md"), KIT_PLAN.replace("slug: kit", "slug: kitimg").replace("name: The Kit", "name: Image Kit"));
    writeFileSync(join(root, "products", "kitimg", "assets", "images", "cover.png"), "png");
    writeFileSync(join(root, "products", "kitimg", "assets", "images", "sheet-1-team.png"), "png");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const kits = readFileSync(join(out, "kits", "index.html"), "utf8");
    expect(kits).toContain('<img class="kit-cover" src="/kits/img/kitimg/cover.png"');
    expect(kits).toContain('src="/kits/img/kitimg/sheet-1-team.png"');
    expect(kits).toMatch(/alt="[^"]*Team[^"]*"/);
    expect(existsSync(join(out, "kits", "img", "kitimg", "cover.png"))).toBe(true);
    expect(kits).toMatch(/"image":\s*"https:\/\/knackdesk\.com\/kits\/img\/kitimg\/cover\.png"/);
    // lightbox: every image is a link tagged with its kit gallery and index; one dialog and script on the page
    expect(kits).toContain('<a href="/kits/img/kitimg/cover.png" data-gallery="kitimg" data-index="0"');
    expect(kits).toContain('<a href="/kits/img/kitimg/sheet-1-team.png" data-gallery="kitimg" data-index="1"');
    expect((kits.match(/<dialog class="lightbox"/g) || []).length).toBe(1);
    expect(kits).toContain('class="lb-prev"');
    expect(kits).toContain('class="lb-next"');
    expect(kits).toContain("data-gallery");
  });
  it("writes a /kits/ page listing every kit with buy links, listing copy, Product schema and FAQ", async () => {
    mkdirSync(join(root, "products", "kit1"), { recursive: true });
    writeFileSync(join(root, "products", "kit1", "PLAN.md"), `---
polar_url: https://buy.polar.sh/kit1
slug: kit1
name: Kit One
lane: digital
category: invoicing
price_cents: 1200
status: live
tagline: One tagline
description: One description.
---
# Kit One

**Audience:** people.

## Listing copy (Polar)
Intro sentence for kit one.
- **Sheet A:** does a.
- **Sheet B:** does b.
Works in Excel.
`);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const page = readFileSync(join(out, "kits", "index.html"), "utf8");
    expect(page).toContain("<h1>");
    expect(page).toContain("Kit One");
    expect(page).toContain('href="https://buy.polar.sh/kit1"');
    expect(page).toContain("$12");
    expect(page).toContain("does a.");
    expect(page).toContain('"Product"');
    expect(page).toContain('"FAQPage"');
    expect(readFileSync(join(out, "sitemap.xml"), "utf8")).toContain("<loc>https://knackdesk.com/kits/</loc>");
    const home = readFileSync(join(out, "index.html"), "utf8");
    expect(home.split("</header>")[0]).toContain('href="/kits/"');
    expect(home).toContain('href="/kits/"');
  });
  it("lists the kits in the footer of every page", async () => {
    mkdirSync(join(root, "products", "kitf"), { recursive: true });
    writeFileSync(join(root, "products", "kitf", "PLAN.md"), `---
polar_url: https://buy.polar.sh/kitf
slug: kitf
name: Footer Kit
lane: digital
category: time
price_cents: 900
status: live
tagline: t
description: d
---`);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    expect(readFileSync(join(out, "about", "index.html"), "utf8").split("<footer>")[1]).toContain('href="/kits/#kitf"');
  });
  it("matches kits that list several categories", async () => {
    mkdirSync(join(root, "products", "kitm"), { recursive: true });
    writeFileSync(join(root, "products", "kitm", "PLAN.md"), `---
polar_url: https://buy.polar.sh/kitm
slug: kitm
name: Kit multi
lane: digital
category: invoicing, time
price_cents: 900
status: live
tagline: t
description: d
---`);
    writeFileSync(join(root, "products", "conv", "public", "index.html"), "<!-- title: Conv -->\n<!-- description: c -->\n<h1>Conv</h1>");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    expect(readFileSync(join(out, "conv", "index.html"), "utf8")).toContain("Kit multi");
  });
  it("appends a cross-sell block for listed digital products to tool pages", async () => {
    mkdirSync(join(root, "products", "kit"), { recursive: true });
    writeFileSync(join(root, "products", "kit", "PLAN.md"), `---
polar_url: https://buy.polar.sh/abc
slug: kit
name: The Kit
lane: digital
price_cents: 1200
status: live
tagline: kit tagline
description: d
---`);
    writeFileSync(join(root, "products", "conv", "public", "index.html"), "<!-- title: Conv -->\n<!-- description: c -->\n<h1>Conv</h1>");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const page = readFileSync(join(out, "conv", "index.html"), "utf8");
    expect(page).toContain('class="crosssell"');
    expect(page).toContain('href="https://buy.polar.sh/abc"');
    expect(page).toContain("The Kit");
    expect(page).toContain("$12");
  });
  it("copies site/public files verbatim to the site root", async () => {
    mkdirSync(join(root, "site", "public"), { recursive: true });
    writeFileSync(join(root, "site", "public", "abc123.txt"), "abc123");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    expect(readFileSync(join(out, "abc123.txt"), "utf8")).toBe("abc123");
  });
  it("wraps a tool page that declares title meta in the site layout, keeping other public files verbatim", async () => {
    mkdirSync(join(root, "products", "wrap", "public"), { recursive: true });
    writeFileSync(join(root, "products", "wrap", "public", "index.html"), "<!-- title: Wrap Tool -->\n<!-- description: wraps -->\n<h1>Wrap</h1>");
    writeFileSync(join(root, "products", "wrap", "public", "calc.js"), "export const x = 1;");
    writeFileSync(join(root, "products", "wrap", "PLAN.md"), `---
slug: wrap
name: Wrap Tool
lane: tool
category: pricing
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
  it("emits one valid JSON-LD graph with WebApplication, FAQPage and breadcrumbs on tool pages", async () => {
    addFeeTool(root);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const page = readFileSync(join(out, "fee", "index.html"), "utf8");
    const graph = ldGraph(page);
    expect(types(graph)).toEqual(expect.arrayContaining(["Organization", "BreadcrumbList", "WebApplication", "FAQPage"]));
    expect(types(graph)).not.toContain("WebSite");
    const app = graph.find((n) => n["@type"] === "WebApplication");
    expect(app).toMatchObject({ name: "Late Fee Calculator", url: "https://knackdesk.com/fee/", description: "Work out a late fee." });
    const faq = graph.find((n) => n["@type"] === "FAQPage");
    expect(faq.mainEntity).toEqual([{ "@type": "Question", name: "Do I count the due date?", acceptedAnswer: { "@type": "Answer", text: "No. Day one is the day after the due date." } }]);
    const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList").itemListElement;
    expect(crumbs.at(-1)).toMatchObject({ name: "Late Fee Calculator", item: "https://knackdesk.com/fee/" });
    expect(crumbs[1]).toMatchObject({ name: "Invoicing & payment", item: "https://knackdesk.com/invoicing/" });
    expect(page).toContain('<meta property="og:type" content="article">');
  });
  it("omits FAQPage when a tool page has no FAQ section", async () => {
    addFeeTool(root);
    writeFileSync(join(root, "products", "fee", "public", "index.html"), "<!-- title: Fee -->\n<!-- description: d -->\n<h1>Fee</h1>\n<p>intro</p>");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const graph = ldGraph(readFileSync(join(out, "fee", "index.html"), "utf8"));
    expect(types(graph)).toContain("WebApplication");
    expect(types(graph)).not.toContain("FAQPage");
  });
  it("inserts the reviewed byline right after the intro paragraph", async () => {
    addFeeTool(root);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const page = readFileSync(join(out, "fee", "index.html"), "utf8");
    const byline = '<p class="byline">By the Knackdesk team · Last reviewed <time datetime="2026-10-01">1 October 2026</time></p>';
    expect(page).toContain(byline);
    expect(page.indexOf("<p>Enter the amount and days late.</p>")).toBeLessThan(page.indexOf(byline));
    expect(page.indexOf(byline)).toBeLessThan(page.indexOf('<p class="definition">'));
  });
  it("leaves out the byline when no reviewed date is set", async () => {
    addFeeTool(root, "");
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    expect(readFileSync(join(out, "fee", "index.html"), "utf8")).not.toContain('class="byline"');
  });
  it("uses the PLAN headline for <title> and og:title but keeps the h1", async () => {
    addFeeTool(root);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const page = readFileSync(join(out, "fee", "index.html"), "utf8");
    expect(page).toContain("<title>Late Payment Fee Calculator: Flat Fee or Interest</title>");
    expect(page).toContain('<meta property="og:title" content="Late Payment Fee Calculator: Flat Fee or Interest">');
    expect(page).toContain("<h1>Late Fee Calculator</h1>");
  });
  it("groups home page tools by category, lists kits in their own section and describes kits as Products", async () => {
    addFeeTool(root);
    mkdirSync(join(root, "products", "kit"), { recursive: true });
    writeFileSync(join(root, "products", "kit", "PLAN.md"), KIT_PLAN);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const index = readFileSync(join(out, "index.html"), "utf8");
    const inv = index.indexOf("<h2>Invoicing &amp; payment</h2>");
    const time = index.indexOf("<h2>Time &amp; pay</h2>");
    const kits = index.indexOf("<h2>Kits</h2>");
    expect(inv).toBeGreaterThan(-1);
    expect(inv).toBeLessThan(time);
    expect(time).toBeLessThan(kits);
    expect(index.slice(inv, time)).toContain('href="/fee/"');
    expect(index.slice(time, kits)).toContain('href="/conv/"');
    expect(index.slice(kits)).toContain('href="https://buy.polar.sh/abc"');
    expect(index).not.toContain("<!--PRODUCTS-->");
    const graph = ldGraph(index);
    expect(types(graph)).toEqual(expect.arrayContaining(["Organization", "WebSite", "Product"]));
    expect(graph.find((n) => n["@type"] === "Product").offers).toMatchObject({ price: "12.00", priceCurrency: "USD", url: "https://buy.polar.sh/abc" });
  });
  it("lists property tools last under Rent & property", async () => {
    mkdirSync(join(root, "products", "rent", "public"), { recursive: true });
    writeFileSync(join(root, "products", "rent", "public", "index.html"), "<h1>Rent</h1>");
    writeFileSync(join(root, "products", "rent", "PLAN.md"), `---
slug: rent
name: Rent Tool
lane: tool
category: property
status: live
tagline: rent things
description: d
---`);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const index = readFileSync(join(out, "index.html"), "utf8");
    const time = index.indexOf("<h2>Time &amp; pay</h2>");
    const prop = index.indexOf("<h2>Rent &amp; property</h2>");
    expect(prop).toBeGreaterThan(time);
    expect(index).toContain("Calculators for tenants, flatmates, landlords and small investors.");
    expect(index.slice(prop)).toContain('href="/rent/"');
    expect(index.slice(time, prop)).not.toContain('href="/rent/"');
  });
  it("gives every site page valid JSON-LD with breadcrumbs except the home page", async () => {
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const about = ldGraph(readFileSync(join(out, "about", "index.html"), "utf8"));
    expect(types(about)).toEqual(expect.arrayContaining(["Organization", "BreadcrumbList"]));
    expect(types(ldGraph(readFileSync(join(out, "index.html"), "utf8")))).not.toContain("BreadcrumbList");
  });
  it("writes llms.txt listing tools, kits with prices and the about page", async () => {
    addFeeTool(root);
    mkdirSync(join(root, "products", "kit"), { recursive: true });
    writeFileSync(join(root, "products", "kit", "PLAN.md"), KIT_PLAN);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const txt = readFileSync(join(out, "llms.txt"), "utf8");
    expect(txt.startsWith("# Knackdesk\n")).toBe(true);
    expect(txt).toContain("## Tools");
    expect(txt).toContain("- [Late Fee Calculator](https://knackdesk.com/fee/): Late fees on overdue invoices");
    expect(txt).toContain("- [Converter](https://knackdesk.com/conv/): converts");
    expect(txt).toContain("## Kits");
    expect(txt).toContain("- [The Kit](https://buy.polar.sh/abc): kit tagline ($12, one-time)");
    expect(txt).toContain("## About");
    expect(txt).toContain("https://knackdesk.com/about/");
    expect(txt).not.toContain("In one sentence");
    expect(txt.indexOf("## Tools")).toBeLessThan(txt.indexOf("## Kits"));
  });
  it("writes llms-full.txt with each tool's definition and formula", async () => {
    addFeeTool(root);
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const txt = readFileSync(join(out, "llms-full.txt"), "utf8");
    expect(txt).toContain("- [Late Fee Calculator](https://knackdesk.com/fee/): Late fees on overdue invoices");
    expect(txt).toContain("In one sentence: A late fee is extra money charged on an overdue invoice.");
    expect(txt).toContain("Formula: fee = amount × rate ÷ 100 × days ÷ 30");
    expect(txt).toContain("## About");
  });
  it("allows AI crawlers explicitly in robots.txt and points to llms.txt", async () => {
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const robots = readFileSync(join(out, "robots.txt"), "utf8");
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) expect(robots).toContain(`User-agent: ${bot}\nAllow: /`);
    expect(robots).toContain("User-agent: *\nAllow: /");
    expect(robots).toContain("# llms.txt: https://knackdesk.com/llms.txt");
  });
});
