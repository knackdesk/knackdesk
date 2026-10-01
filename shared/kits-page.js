import { escapeHtml } from "./layout.js";

const inline = (text) => escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

export function parseListingCopy(body = "") {
  const idx = body.indexOf("## Listing copy");
  if (idx === -1) return { intro: "", bullets: [], outro: "" };
  const lines = body.slice(idx).split("\n").slice(1).map((l) => l.trim()).filter(Boolean).filter((l) => !l.startsWith("#"));
  const bullets = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
  const prose = lines.filter((l) => !l.startsWith("- "));
  return { intro: prose[0] || "", bullets, outro: prose.slice(1).join(" ") };
}

export function sheetAlt(name, file) {
  const sheet = file.replace(/^sheet-\d+-/, "").replace(/\.png$/, "").replace(/-/g, " ");
  const pretty = sheet.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bP L\b/, "P&L").replace(/\bPto\b/, "PTO").replace(/\bSaas\b/, "SaaS");
  return `${pretty} sheet of ${name}`;
}

function kitImages({ data, images = [] }) {
  if (images.length === 0) return "";
  const base = `/kits/img/${escapeHtml(data.slug)}`;
  const cover = images.includes("cover.png") ? `<img class="kit-cover" src="${base}/cover.png" alt="${escapeHtml(data.name)} cover" width="1200" height="800" loading="lazy">` : "";
  const shots = images.filter((f) => f !== "cover.png").map((f) => `<a href="${base}/${escapeHtml(f)}"><img src="${base}/${escapeHtml(f)}" alt="${escapeHtml(sheetAlt(data.name, f))}" loading="lazy"></a>`).join("");
  return `${cover}${shots ? `<div class="kit-shots">${shots}</div>` : ""}`;
}

function kitArticle({ data, body, images }) {
  const copy = parseListingCopy(body);
  const price = `$${(data.price_cents / 100).toFixed(0)}`;
  const bullets = copy.bullets.map((b) => `<li>${inline(b)}</li>`).join("");
  return `<article class="kit" id="${escapeHtml(data.slug)}">
<h2>${escapeHtml(data.name)} <span class="kit-price">${price}</span></h2>
<p class="kit-tagline">${escapeHtml(data.tagline)}</p>
${kitImages({ data, images })}
${copy.intro ? `<p>${inline(copy.intro)}</p>` : ""}
${bullets ? `<ul class="kit-features">${bullets}</ul>` : ""}
${copy.outro ? `<p class="small">${inline(copy.outro)}</p>` : ""}
<p><a class="buy big" href="${escapeHtml(data.polar_url)}">Get ${escapeHtml(data.name)} for ${price}</a></p>
</article>`;
}

export function renderKitsPage(kits) {
  const articles = kits.map(kitArticle).join("\n");
  return `<h1>Spreadsheet kits</h1>
<p>Each kit is a single workbook you buy once and keep. Formulas only, no macros, no sign-up. They open in Excel (2010 or later), Google Sheets and Apple Numbers, and every formula is checked by recalculating the whole workbook before release. The free calculators on this site answer one question at a time; the kits keep the answers together and update them as you add rows.</p>
${articles}
<h2>Frequently asked questions</h2>
<h3>How is a kit delivered?</h3>
<p>Payment is handled by Polar, the merchant of record. After checkout you land on a confirmation page and receive an email with a download link for the zip (the workbook plus a short README). The link stays valid, so you can download it again later.</p>
<h3>Which apps open the workbooks?</h3>
<p>Microsoft Excel 2010 or later, Google Sheets (File > Import) and Apple Numbers. There are no macros, so nothing needs enabling.</p>
<h3>Can I get a refund?</h3>
<p>Yes. Refunds are handled by Polar under its refund policy; write to hello@knackdesk.com with the email you used at checkout and we will sort it out.</p>
<h3>Is VAT or sales tax added?</h3>
<p>Polar adds the tax that applies in your country at checkout and issues the receipt, so the price shown is before any tax that applies to you.</p>
<h3>Can I use a kit for my clients or team?</h3>
<p>Each kit is licensed for personal or single-business use. Use it for your own business and clients; please do not resell or redistribute the file itself.</p>`;
}
