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

const shortName = (name) => name.replace(/\s+(Calculator|Converter)$/i, "");

const MENU_TOOLS_PER_CATEGORY = 6;
const MENU_KITS = 4;
const FOOTER_KITS = 6;

export function renderMegaMenu(items) {
  const tools = items.filter(({ data }) => data.lane !== "digital");
  const kits = items.filter(({ data }) => data.lane === "digital");
  const cols = CATEGORY_SECTIONS.map((c) => {
    const inCat = tools.filter(({ data }) => data.category === c.key);
    if (inCat.length === 0) return "";
    const lis = inCat.slice(0, MENU_TOOLS_PER_CATEGORY).map(({ data }) => `<li><a href="/${escapeHtml(data.slug)}/" title="${escapeHtml(data.name)}">${escapeHtml(shortName(data.name))}</a></li>`);
    if (inCat.length > MENU_TOOLS_PER_CATEGORY) lis.push(`<li class="more"><a href="/${c.key}/">All ${inCat.length} ${escapeHtml(c.heading.toLowerCase())} calculators →</a></li>`);
    return `<details class="mega-cat" open><summary><h3><a href="/${c.key}/">${escapeHtml(c.heading)}</a></h3></summary><ul>${lis.join("")}</ul></details>`;
  }).filter(Boolean);
  if (kits.length) {
    const lis = kits.slice(0, MENU_KITS).map(({ data }) => `<li><a href="${escapeHtml(data.polar_url || "/kits/")}">${escapeHtml(data.name)} <span class="price">$${(data.price_cents / 100).toFixed(0)}</span></a></li>`);
    lis.push(`<li class="more"><a href="/kits/">All ${kits.length} kits →</a></li>`);
    cols.push(`<details class="mega-cat mega-kits" open><summary><h3><a href="/kits/">Kits</a></h3></summary><ul>${lis.join("")}</ul></details>`);
  }
  return `<details class="menu"><summary>Tools<span class="caret" aria-hidden="true">▾</span></summary><div class="mega"><div class="mega-top"><span>All tools</span><button type="button" class="mega-close" aria-label="Close menu">×</button></div><div class="mega-grid">${cols.join("")}</div></div></details>`;
}

const FINDER_SCRIPT = `<script>(()=>{const init=()=>{const q=document.getElementById("finder"),empty=document.getElementById("finder-empty");if(!q)return;const cards=[...document.querySelectorAll("section.category .cards li")],sections=[...document.querySelectorAll("section.category")];const norm=(s)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");const apply=()=>{const t=norm(q.value.trim());let shown=0;for(const li of cards){const hit=!t||norm(li.textContent).includes(t);li.hidden=!hit;if(hit)shown++}for(const s of sections){const any=[...s.querySelectorAll(".cards li")].some((li)=>!li.hidden);s.hidden=!any;const more=s.querySelector(".more");if(more)more.hidden=!!t}empty.hidden=shown>0;document.body.classList.toggle("finding",!!t)};q.addEventListener("input",apply);q.addEventListener("search",apply);const u=new URL(location.href).searchParams.get("q");if(u){q.value=u;apply()}};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()})();</script>`;

export function renderFinder(items) {
  const tools = items.filter(({ data }) => data.lane !== "digital");
  const kits = items.filter(({ data }) => data.lane === "digital");
  const chips = CATEGORY_SECTIONS.map((c) => {
    const n = tools.filter(({ data }) => data.category === c.key).length;
    return n ? `<a class="chip" href="/${c.key}/">${escapeHtml(c.nav)}<span class="count">${n}</span></a>` : "";
  }).filter(Boolean);
  if (kits.length) chips.push(`<a class="chip chip-kits" href="/kits/">Kits<span class="count">${kits.length}</span></a>`);
  return `<div class="finder"><label for="finder" class="visually-hidden">Find a calculator</label><input type="search" id="finder" placeholder="Find a calculator, e.g. late fee, margin, PTO…" autocomplete="off" spellcheck="false"><p class="finder-hint">${tools.length} free calculators${kits.length ? ` and ${kits.length} kits` : ""}. Type to filter, or pick a category.</p><nav class="chips" aria-label="Categories">${chips.join("")}</nav><p id="finder-empty" hidden>No calculator matches that. Try another word, or <a href="/contact/">tell us what you were looking for</a>.</p></div>${FINDER_SCRIPT}`;
}

export function renderPage({ title, description, body, path, adsenseId = "", headline = "", ogType = "website", schema = [], parent = null, menu = "", assetVersion = "", footerKits = [] }) {
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
<link rel="stylesheet" href="/styles.css${assetVersion ? `?v=${escapeHtml(assetVersion)}` : ""}">
${renderJsonLd(pageGraph({ title, path, schema, parent }))}
${adsense(adsenseId)}
</head>
<body>
<header class="top"><a class="brand" href="/"><img src="/icon.svg" alt="" width="28" height="28"><span>Knackdesk</span></a><nav aria-label="Site">${menu || CATEGORY_SECTIONS.map((c) => `<a class="navlink" href="/${c.key}/">${escapeHtml(c.nav)}</a>`).join("")}<a class="navlink" href="/kits/">Kits</a><a class="navlink" href="/about/">About</a></nav></header>
<main>
${crumbs({ title, path, parent })}${body}
</main>
<footer>
<div class="foot">
<div class="foot-brand"><a class="brand" href="/">Knackdesk</a><p>Small, useful calculators and spreadsheet kits for freelancers, small businesses, landlords and online sellers. Free to use; nothing you enter leaves your browser.</p><p><a href="mailto:hello@knackdesk.com">hello@knackdesk.com</a></p></div>
<div class="foot-col"><h4>Tools</h4><ul>${CATEGORY_SECTIONS.map((c) => `<li><a href="/${c.key}/">${escapeHtml(c.heading)}</a></li>`).join("")}</ul></div>
<div class="foot-col"><h4>Kits</h4><ul>${footerKits.slice(0, FOOTER_KITS).map((k) => `<li><a href="/kits/#${escapeHtml(k.slug)}">${escapeHtml(k.name)}</a></li>`).join("")}<li><a href="/kits/">All${footerKits.length > FOOTER_KITS ? ` ${footerKits.length}` : ""} kits</a></li></ul></div>
<div class="foot-col"><h4>Knackdesk</h4><ul><li><a href="/about/">About</a></li><li><a href="/guides/">Guides</a></li><li><a href="/contact/">Contact</a></li><li><a href="/kits/">Kits</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="/terms/">Terms</a></li></ul></div>
</div>
<div class="foot-bottom"><p class="disclaimer">Tools on this site provide general information and arithmetic only, not legal, tax or financial advice. Check important figures with a qualified adviser.</p><p class="copy">© ${new Date().getUTCFullYear()} Knackdesk</p></div>
</footer>
<button type="button" class="totop" aria-label="Back to top" hidden>↑</button>
<script>(()=>{const b=document.querySelector(".totop");if(b){const t=()=>{b.hidden=window.scrollY<600};window.addEventListener("scroll",t,{passive:true});t();b.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}))}})();</script>
<script>(()=>{const m=document.querySelector("details.menu");if(!m)return;const narrow=()=>window.matchMedia("(max-width: 640px)").matches;const closeAll=()=>m.removeAttribute("open");m.addEventListener("toggle",()=>{if(m.open&&narrow())for(const c of m.querySelectorAll("details.mega-cat"))c.removeAttribute("open");if(m.open&&!narrow())for(const c of m.querySelectorAll("details.mega-cat"))c.setAttribute("open","");document.body.classList.toggle("menu-open",m.open&&narrow())});document.addEventListener("click",(e)=>{if(e.target.closest(".mega-close")){closeAll();return}if(m.open&&!m.contains(e.target))closeAll()});document.addEventListener("keydown",(e)=>{if(e.key==="Escape")closeAll()})})();</script>
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
  { key: "ecommerce", nav: "Selling", heading: "Selling online", intro: "Profit per order after fees and shipping, free-shipping thresholds, stock turnover, reorder points and the ad return you need." },
];

function section({ id, heading, intro, list, href }) {
  const more = href ? `\n<p class="more"><a href="${escapeHtml(href)}">${id === "kits" ? "All kits" : `All ${escapeHtml(heading.toLowerCase())} calculators`} →</a></p>` : "";
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
    parts.push(section({ id: "kits", heading: "Kits", intro: "Spreadsheet workbooks you buy once and keep. They work in Excel, Google Sheets and Numbers.", list: renderKitCards(kits), href: "/kits/" }));
  }
  return parts.join("\n");
}
