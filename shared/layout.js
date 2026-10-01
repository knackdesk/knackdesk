import { SITE, OG_IMAGE, organizationNode, websiteNode, breadcrumbNode, renderJsonLd } from "./seo.js";

const CF_BEACON_TOKEN = "859048f35cc94810a6dbcd305ed05ea6";

export function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function adsense(id) {
  if (!id) return "";
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${escapeHtml(id)}" crossorigin="anonymous"></script>`;
}

function pageGraph({ title, path, schema, parent }) {
  const base = path === "/" ? [organizationNode(), websiteNode()] : [organizationNode(), breadcrumbNode({ name: title, path, parent })];
  return [...base, ...schema];
}

function crumbs({ title, path, parent }) {
  if (path === "/") return "";
  const links = [`<a href="/">Home</a>`, ...(parent ? [`<a href="${escapeHtml(parent.path)}">${escapeHtml(parent.name)}</a>`] : []), `<span>${escapeHtml(title)}</span>`];
  return `<nav class="crumbs" aria-label="Breadcrumb">${links.join(" › ")}</nav>\n`;
}

function socialMeta({ title, description, url, ogType }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return `<meta property="og:type" content="${escapeHtml(ogType)}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Knackdesk">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${OG_IMAGE}">`;
}

export function renderMegaMenu(items) {
  const tools = items.filter(({ data }) => data.lane !== "digital");
  const kits = items.filter(({ data }) => data.lane === "digital");
  const cols = CATEGORY_SECTIONS.map((c) => {
    const inCat = tools.filter(({ data }) => data.category === c.key);
    if (inCat.length === 0) return "";
    const lis = inCat.map(({ data }) => `<li><a href="/${escapeHtml(data.slug)}/">${escapeHtml(data.name)}</a></li>`).join("");
    return `<div class="mega-col"><h3><a href="/${c.key}/">${escapeHtml(c.heading)}</a></h3><ul>${lis}</ul></div>`;
  }).filter(Boolean);
  if (kits.length) {
    const lis = kits.map(({ data }) => `<li><a href="${escapeHtml(data.polar_url || "/#kits")}">${escapeHtml(data.name)} <span class="price">$${(data.price_cents / 100).toFixed(0)}</span></a></li>`).join("");
    cols.push(`<div class="mega-col mega-kits"><h3><a href="/#kits">Kits</a></h3><ul>${lis}</ul></div>`);
  }
  return `<details class="menu"><summary>Tools<span class="caret" aria-hidden="true">▾</span></summary><div class="mega">${cols.join("")}</div></details>`;
}

export function renderPage({ title, description, body, path, adsenseId = "", headline = "", ogType = "website", schema = [], parent = null, menu = "" }) {
  const docTitle = headline || title;
  const titleTag = headline || `${title} · Knackdesk`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(titleTag)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE}${path}">
<link rel="icon" href="/icon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${socialMeta({ title: docTitle, description, url: `${SITE}${path}`, ogType })}
<link rel="stylesheet" href="/styles.css">
${renderJsonLd(pageGraph({ title, path, schema, parent }))}
${adsense(adsenseId)}
</head>
<body>
<header class="top"><a class="brand" href="/">Knackdesk</a><nav aria-label="Site">${menu || CATEGORY_SECTIONS.map((c) => `<a href="/${c.key}/">${escapeHtml(c.nav)}</a>`).join("")}<a class="navlink" href="/#kits">Kits</a></nav></header>
<main>
${crumbs({ title, path, parent })}${body}
</main>
<footer><p class="disclaimer">Tools on this site provide general information and arithmetic only, not legal, tax or financial advice. Check important figures with a qualified adviser.</p><div class="footcats">${CATEGORY_SECTIONS.map((c) => `<a href="/${c.key}/">${escapeHtml(c.heading)}</a>`).join("")}</div><div class="footlinks"><span>© Knackdesk</span><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></div></footer>
<script>document.addEventListener("click",(e)=>{for(const d of document.querySelectorAll("details.menu[open]"))if(!d.contains(e.target))d.removeAttribute("open")});document.addEventListener("keydown",(e)=>{if(e.key==="Escape")for(const d of document.querySelectorAll("details.menu[open]"))d.removeAttribute("open")});</script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${CF_BEACON_TOKEN}"}'></script>
</body>
</html>`;
}

function cardHref(data) {
  return data.lane === "digital" ? data.polar_url || "#" : `/${data.slug}/`;
}

export function renderProductCards(items) {
  const lis = items
    .map(({ data }) => `<li><a href="${escapeHtml(cardHref(data))}"><strong>${escapeHtml(data.name)}</strong><span>${escapeHtml(data.tagline)}</span></a></li>`)
    .join("\n");
  return `<ul class="cards">\n${lis}\n</ul>`;
}

export const CATEGORY_SECTIONS = [
  { key: "invoicing", nav: "Invoicing", heading: "Invoicing & payment", intro: "Due dates, late fees, deposits, early payment discounts and VAT for the invoices you send and receive." },
  { key: "pricing", nav: "Pricing", heading: "Rates & pricing", intro: "Set and check what you charge: hourly and day rates, markup and margin, discounts, price rises, retainers and commission." },
  { key: "planning", nav: "Planning", heading: "Planning & cash", intro: "See how long your cash lasts, what you need to sell to break even or hit a goal, and what your software really costs." },
  { key: "time", nav: "Time & pay", heading: "Time & pay", intro: "Turn hours into invoice-ready decimals, count working days and work out overtime pay." },
  { key: "property", nav: "Property", heading: "Rent & property", intro: "Calculators for tenants, flatmates, landlords and small investors." },
];

function section({ id, heading, intro, list, href }) {
  const more = href ? `\n<p class="more"><a href="${escapeHtml(href)}">All ${escapeHtml(heading.toLowerCase())} calculators →</a></p>` : "";
  return `<section class="category" id="${id}">\n<h2>${escapeHtml(heading)}</h2>\n<p class="category-intro">${escapeHtml(intro)}</p>\n${list}${more}\n</section>`;
}

function renderKitCards(kits) {
  const lis = kits
    .map(({ data }) => `<li><a href="${escapeHtml(cardHref(data))}"><strong>${escapeHtml(data.name)}</strong><span>${escapeHtml(data.tagline)}</span><span class="price">$${(data.price_cents / 100).toFixed(0)}, one-time</span></a></li>`)
    .join("\n");
  return `<ul class="cards">\n${lis}\n</ul>`;
}

export function renderCatalogSections(items) {
  const tools = items.filter(({ data }) => data.lane !== "digital");
  const kits = items.filter(({ data }) => data.lane === "digital");
  const parts = CATEGORY_SECTIONS.map(({ key, heading, intro }) => {
    const inCat = tools.filter(({ data }) => data.category === key);
    return inCat.length ? section({ id: key, heading, intro, list: renderProductCards(inCat), href: `/${key}/` }) : "";
  }).filter(Boolean);
  if (kits.length) {
    parts.push(section({ id: "kits", heading: "Kits", intro: "Spreadsheet workbooks you buy once and keep. They work in Excel, Google Sheets and Numbers.", list: renderKitCards(kits) }));
  }
  return parts.join("\n");
}
