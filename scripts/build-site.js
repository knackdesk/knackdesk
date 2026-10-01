import { readdirSync, readFileSync, mkdirSync, writeFileSync, cpSync, existsSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { loadCatalog } from "./lib/catalog.js";
import { CATEGORY_SECTIONS, renderPage, renderCatalogSections, renderProductCards, renderMegaMenu, escapeHtml } from "../shared/layout.js";
import { CATEGORY_COPY } from "../shared/category-copy.js";
import { renderKitsPage } from "../shared/kits-page.js";
import { webApplicationNode, faqPageNode, productNode, htmlToText } from "../shared/seo.js";
import { collectionPageNode } from "../shared/seo.js";
import { renderLlmsTxt, renderLlmsFullTxt } from "./lib/llms.js";

const ROBOTS = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# llms.txt: https://knackdesk.com/llms.txt
Sitemap: https://knackdesk.com/sitemap.xml
`;

function pageMeta(html, key) {
  const m = html.match(new RegExp(`<!--\\s*${key}:\\s*(.*?)\\s*-->`));
  return m ? m[1] : "";
}

function writePage(outDir, path, html) {
  const dir = path === "/" ? outDir : join(outDir, path.replace(/^\/|\/$/g, ""));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

export function renderSitemap(paths) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths.map((p) => `  <url><loc>https://knackdesk.com${p}</loc><lastmod>${today}</lastmod></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderCrossSell(digitalItems) {
  if (digitalItems.length === 0) return "";
  const cards = digitalItems
    .map(({ data }) => `<p><strong>${escapeHtml(data.name)}</strong> — ${escapeHtml(data.tagline)} <a class="buy" href="${escapeHtml(data.polar_url)}">Get it for $${(data.price_cents / 100).toFixed(0)}</a></p>`)
    .join("\n");
  return `<aside class="crosssell"><h2>Keep all of this in one spreadsheet</h2>\n${cards}\n<p class="small">One-time purchase, delivered by Polar. Works in Excel, Google Sheets and Numbers.</p></aside>`;
}

export function formatReviewed(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function insertByline(html, reviewed) {
  if (!reviewed) return html;
  const byline = `<p class="byline">By the Knackdesk team · Last reviewed <time datetime="${escapeHtml(reviewed)}">${formatReviewed(reviewed)}</time></p>`;
  const h1End = html.indexOf("</h1>");
  if (h1End < 0) return html;
  const pEnd = html.indexOf("</p>", h1End);
  if (pEnd < 0) return html;
  const at = pEnd + "</p>".length;
  return `${html.slice(0, at)}\n${byline}${html.slice(at)}`;
}

function blockText(html, cls) {
  const m = html.match(new RegExp(`<p class="${cls}">([\\s\\S]*?)</p>`));
  return m ? htmlToText(m[1]) : "";
}

function wrapToolPage(file, path, adsenseId, crossSell, data, parent = null, menu = "", assetVersion = "") {
  if (!existsSync(file)) return null;
  const raw = readFileSync(file, "utf8");
  const title = pageMeta(raw, "title");
  if (!title) return null;
  const description = pageMeta(raw, "description");
  const schema = [webApplicationNode({ name: title, path, description }), faqPageNode(raw)].filter(Boolean);
  const body = `${insertByline(raw, data.reviewed)}\n${crossSell}`;
  writeFileSync(file, renderPage({ title, description, body, path, adsenseId, headline: data.headline || "", ogType: "article", schema, parent, menu, assetVersion }));
  return { definition: blockText(raw, "definition"), formula: blockText(raw, "formula") };
}

export async function buildSite({ rootDir, outDir, adsenseId = "" }) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const items = (await loadCatalog(rootDir)).filter(({ data }) => {
    if (data.lane === "digital" && !data.polar_url) {
      console.warn(`skip ${data.slug}: live digital product has no polar_url yet (run npm run polar:create -- ${data.slug})`);
      return false;
    }
    return true;
  });
  const digital = items.filter(({ data }) => data.lane === "digital");
  const sections = renderCatalogSections(items);
  const kitCategories = (data) => String(data.category || "").split(",").map((c) => c.trim()).filter(Boolean);
  const kitsFor = (category) => {
    const matching = digital.filter(({ data }) => kitCategories(data).includes(category));
    return matching.length > 0 ? matching : digital;
  };
  const crossSellFor = (category) => renderCrossSell(kitsFor(category));
  const menu = renderMegaMenu(items);
  const assetVersion = createHash("sha256").update(readFileSync(join(rootDir, "shared", "styles.css"))).digest("hex").slice(0, 10);
  const categoryOf = (key) => CATEGORY_SECTIONS.find((c) => c.key === key);
  const pagesDir = join(rootDir, "site", "pages");
  for (const file of readdirSync(pagesDir).filter((f) => f.endsWith(".html"))) {
    const raw = readFileSync(join(pagesDir, file), "utf8");
    const name = basename(file, ".html");
    const path = name === "index" ? "/" : `/${name}/`;
    const body = raw.replace("<!--PRODUCTS-->", () => sections);
    const schema = path === "/" ? digital.map(({ data }) => productNode(data)) : [];
    writePage(outDir, path, renderPage({ title: pageMeta(raw, "title"), description: pageMeta(raw, "description"), body, path, adsenseId, schema, menu, assetVersion }));
  }
  const details = {};
  for (const { dir, data } of items) {
    const pub = join(dir, "public");
    if (!existsSync(pub)) continue;
    cpSync(pub, join(outDir, data.slug), { recursive: true });
    const cat = categoryOf(data.category);
    const parent = cat ? { name: cat.heading, path: `/${cat.key}/` } : null;
    const d = wrapToolPage(join(outDir, data.slug, "index.html"), `/${data.slug}/`, adsenseId, crossSellFor(data.category), data, parent, menu, assetVersion);
    if (d) details[data.slug] = d;
  }
  const tools = items.filter(({ data }) => data.lane !== "digital");
  const categoryPages = CATEGORY_SECTIONS.filter((c) => tools.some(({ data }) => data.category === c.key));
  for (const c of categoryPages) {
    const copy = CATEGORY_COPY[c.key];
    const inCat = tools.filter(({ data }) => data.category === c.key);
    const path = `/${c.key}/`;
    const body = `<h1>${escapeHtml(copy.title)}</h1>\n${copy.intro}\n${renderProductCards(inCat)}\n${renderCrossSell(kitsFor(c.key))}`;
    const schema = [collectionPageNode({ name: copy.title, description: copy.description, path, items: inCat.map(({ data }) => ({ name: data.name, path: `/${data.slug}/` })) })];
    writePage(outDir, path, renderPage({ title: copy.title, description: copy.description, headline: copy.headline, body, path, adsenseId, schema, menu, assetVersion }));
  }
  if (digital.length > 0) {
    const body = renderKitsPage(digital);
    const schema = [...digital.map(({ data }) => productNode(data)), faqPageNode(body)].filter(Boolean);
    writePage(outDir, "/kits/", renderPage({ title: "Spreadsheet Kits", headline: "Spreadsheet Kits for Freelancers and Landlords: Buy Once, Keep Forever", description: "Workbooks for invoicing and cash flow, pricing and quotes, and rent tracking. Formulas only, no macros; work in Excel, Google Sheets and Numbers. One-time purchase.", body, path: "/kits/", adsenseId, schema, menu, assetVersion }));
  }
  const categoryLinks = categoryPages.map((c) => ({ key: c.key, heading: c.heading, path: `/${c.key}/` }));
  writeFileSync(join(outDir, "llms.txt"), renderLlmsTxt(items, categoryLinks));
  writeFileSync(join(outDir, "llms-full.txt"), renderLlmsFullTxt(items, details, categoryLinks));
  const urls = ["/", ...(digital.length > 0 ? ["/kits/"] : []), ...categoryPages.map((c) => `/${c.key}/`), ...readdirSync(pagesDir).filter((f) => f.endsWith(".html") && f !== "index.html").map((f) => `/${basename(f, ".html")}/`), ...items.map(({ data }) => `/${data.slug}/`)];
  writeFileSync(join(outDir, "sitemap.xml"), renderSitemap(urls));
  if (adsenseId) writeFileSync(join(outDir, "ads.txt"), `google.com, ${adsenseId.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`);
  writeFileSync(join(outDir, "robots.txt"), ROBOTS);
  const staticDir = join(rootDir, "site", "public");
  if (existsSync(staticDir)) cpSync(staticDir, outDir, { recursive: true });
  cpSync(join(rootDir, "site", "CNAME"), join(outDir, "CNAME"));
  cpSync(join(rootDir, "shared", "styles.css"), join(outDir, "styles.css"));
  return items.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rootDir = process.cwd();
  const count = await buildSite({ rootDir, outDir: join(rootDir, "dist"), adsenseId: process.env.ADSENSE_CLIENT_ID || "" });
  console.log(`built site with ${count} live products`);
}
