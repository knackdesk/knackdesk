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
  const g = escapeHtml(data.slug);
  const ordered = [...images.filter((f) => f === "cover.png"), ...images.filter((f) => f !== "cover.png")];
  const link = (f, i, inner) => `<a href="${base}/${escapeHtml(f)}" data-gallery="${g}" data-index="${i}" data-alt="${escapeHtml(f === "cover.png" ? `${data.name} cover` : sheetAlt(data.name, f))}">${inner}</a>`;
  const cover = ordered[0] === "cover.png" ? link("cover.png", 0, `<img class="kit-cover" src="${base}/cover.png" alt="${escapeHtml(data.name)} cover" width="1200" height="800" loading="lazy">`) : "";
  const shots = ordered.map((f, i) => (f === "cover.png" ? "" : link(f, i, `<img src="${base}/${escapeHtml(f)}" alt="${escapeHtml(sheetAlt(data.name, f))}" loading="lazy">`))).join("");
  return `${cover}${shots ? `<div class="kit-shots">${shots}</div>` : ""}`;
}

function kitArticle({ data, body, images }) {
  const copy = parseListingCopy(body);
  const price = `$${(data.price_cents / 100).toFixed(0)}`;
  const bullets = copy.bullets.map((b) => `<li>${inline(b)}</li>`).join("");
  const inside = bullets || copy.intro ? `<details class="kit-inside"><summary>What is inside</summary>${copy.intro ? `<p>${inline(copy.intro)}</p>` : ""}${bullets ? `<ul class="kit-features">${bullets}</ul>` : ""}${copy.outro ? `<p class="small">${inline(copy.outro)}</p>` : ""}</details>` : "";
  return `<article class="kit" id="${escapeHtml(data.slug)}">
${kitImages({ data, images })}
<h2>${escapeHtml(data.name)} <span class="kit-price">${price}</span></h2>
<p class="kit-tagline">${escapeHtml(data.tagline)}</p>
${inside}
<p class="kit-buy"><a class="buy big" href="${escapeHtml(data.polar_url)}">Get it for ${price}</a></p>
</article>`;
}


export const LIGHTBOX = `<dialog class="lightbox" aria-label="Image viewer"><button type="button" class="lb-close" aria-label="Close">×</button><button type="button" class="lb-prev" aria-label="Previous image">‹</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lb-next" aria-label="Next image">›</button></dialog>
<script>(()=>{const dlg=document.querySelector("dialog.lightbox");if(!dlg||!dlg.showModal)return;const img=dlg.querySelector("img"),cap=dlg.querySelector("figcaption");let items=[],i=0;const show=(n)=>{i=(n+items.length)%items.length;const a=items[i];img.src=a.getAttribute("href");img.alt=a.dataset.alt||"";cap.textContent=(a.dataset.alt||"")+" ("+(i+1)+"/"+items.length+")";dlg.querySelector(".lb-prev").hidden=dlg.querySelector(".lb-next").hidden=items.length<2};document.addEventListener("click",(e)=>{const a=e.target.closest("a[data-gallery]");if(!a)return;e.preventDefault();items=[...document.querySelectorAll('a[data-gallery="'+a.dataset.gallery+'"]')];show(Number(a.dataset.index)||0);dlg.showModal()});dlg.querySelector(".lb-close").addEventListener("click",()=>dlg.close());dlg.querySelector(".lb-prev").addEventListener("click",()=>show(i-1));dlg.querySelector(".lb-next").addEventListener("click",()=>show(i+1));dlg.addEventListener("click",(e)=>{if(e.target===dlg)dlg.close()});dlg.addEventListener("keydown",(e)=>{if(e.key==="ArrowLeft")show(i-1);if(e.key==="ArrowRight")show(i+1)});let sx=null;dlg.addEventListener("touchstart",(e)=>{sx=e.touches[0].clientX},{passive:true});dlg.addEventListener("touchend",(e)=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>40)show(dx<0?i+1:i-1)})})();</script>`;

export function renderKitsPage(kits) {
  const articles = `<div class="kits-grid">\n${kits.map(kitArticle).join("\n")}\n</div>`;
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
<p>Each kit is licensed for personal or single-business use. Use it for your own business and clients; please do not resell or redistribute the file itself.</p>` + LIGHTBOX;
}
