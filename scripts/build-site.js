import { readdirSync, readFileSync, mkdirSync, writeFileSync, cpSync, existsSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalog } from "./lib/catalog.js";
import { renderPage, renderProductCards } from "../shared/layout.js";

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

function wrapToolPage(file, path, adsenseId) {
  if (!existsSync(file)) return;
  const raw = readFileSync(file, "utf8");
  const title = pageMeta(raw, "title");
  if (!title) return;
  writeFileSync(file, renderPage({ title, description: pageMeta(raw, "description"), body: raw, path, adsenseId }));
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
  const cards = renderProductCards(items);
  const pagesDir = join(rootDir, "site", "pages");
  for (const file of readdirSync(pagesDir).filter((f) => f.endsWith(".html"))) {
    const raw = readFileSync(join(pagesDir, file), "utf8");
    const name = basename(file, ".html");
    const path = name === "index" ? "/" : `/${name}/`;
    const body = raw.replace("<!--PRODUCTS-->", () => cards);
    writePage(outDir, path, renderPage({ title: pageMeta(raw, "title"), description: pageMeta(raw, "description"), body, path, adsenseId }));
  }
  for (const { dir, data } of items) {
    const pub = join(dir, "public");
    if (!existsSync(pub)) continue;
    cpSync(pub, join(outDir, data.slug), { recursive: true });
    wrapToolPage(join(outDir, data.slug, "index.html"), `/${data.slug}/`, adsenseId);
  }
  const urls = ["/", ...readdirSync(pagesDir).filter((f) => f.endsWith(".html") && f !== "index.html").map((f) => `/${basename(f, ".html")}/`), ...items.map(({ data }) => `/${data.slug}/`)];
  writeFileSync(join(outDir, "sitemap.xml"), renderSitemap(urls));
  writeFileSync(join(outDir, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://knackdesk.com/sitemap.xml\n");
  cpSync(join(rootDir, "site", "CNAME"), join(outDir, "CNAME"));
  cpSync(join(rootDir, "shared", "styles.css"), join(outDir, "styles.css"));
  return items.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rootDir = process.cwd();
  const count = await buildSite({ rootDir, outDir: join(rootDir, "dist"), adsenseId: process.env.ADSENSE_CLIENT_ID || "" });
  console.log(`built site with ${count} live products`);
}
