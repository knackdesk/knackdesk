import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync, readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "../build-site.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAX_CROSS_SELL = 3;
const MAX_FOOTER_KITS = 6;

function pagesUnder(dir, prefix = "") {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...pagesUnder(p, `${prefix}/${name}`));
    else if (name === "index.html") out.push({ path: `${prefix}/`, html: readFileSync(p, "utf8") });
  }
  return out;
}

let out, pages, products;
beforeAll(async () => {
  out = mkdtempSync(join(tmpdir(), "audit-"));
  await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
  pages = pagesUnder(out);
  products = readdirSync(join(root, "products")).filter((d) => existsSync(join(root, "products", d, "public", "index.html")));
}, 60000);

describe("real site audit", () => {
  it("builds every live tool and every site page", () => {
    expect(pages.length).toBeGreaterThan(70);
    for (const slug of products) expect(pages.some((p) => p.path === `/${slug}/`), slug).toBe(true);
  });
  it("has no internal link that points to a page that does not exist", () => {
    const built = new Set(pages.map((p) => p.path));
    const broken = [];
    for (const { path, html } of pages) {
      for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
        const target = m[1];
        if (/\.(css|svg|png|xml|txt|js|ico)$/.test(target)) continue;
        const norm = target.endsWith("/") ? target : `${target}/`;
        if (!built.has(norm)) broken.push(`${path} -> ${target}`);
      }
    }
    expect(broken).toEqual([]);
  });
  it("gives every tool page a definition, a formula, a data-privacy FAQ and related tools", () => {
    const missing = [];
    for (const slug of products) {
      const html = pages.find((p) => p.path === `/${slug}/`).html;
      for (const [label, re] of [["definition", /class="definition"/], ["formula", /class="formula"/], ["privacy FAQ", /Is my data stored\?/], ["related tools", /<h2>Related tools<\/h2>/], ["FAQ schema", /"FAQPage"/]]) {
        if (!re.test(html)) missing.push(`${slug}: ${label}`);
      }
    }
    expect(missing).toEqual([]);
  });
  it("shows at most three kits in a cross-sell block and at most six in the footer", () => {
    const over = [];
    for (const { path, html } of pages) {
      const aside = html.split('<aside class="crosssell">')[1]?.split("</aside>")[0];
      if (aside) {
        const n = (aside.match(/class="buy"/g) || []).length;
        if (n > MAX_CROSS_SELL) over.push(`${path}: ${n} kits in cross-sell`);
      }
      const footer = html.split("<h4>Kits</h4>")[1]?.split("</ul>")[0] || "";
      const fk = (footer.match(/href="\/kits\/#/g) || []).length;
      if (fk > MAX_FOOTER_KITS) over.push(`${path}: ${fk} kits in footer`);
    }
    expect(over).toEqual([]);
  });
  it("keeps headlines within 60 characters and titles unique", () => {
    const titles = new Map();
    for (const { path, html } of pages) {
      const t = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      expect(t.length, `${path} title`).toBeGreaterThan(0);
      if (titles.has(t)) throw new Error(`duplicate title "${t}" on ${path} and ${titles.get(t)}`);
      titles.set(t, path);
    }
  });
});
