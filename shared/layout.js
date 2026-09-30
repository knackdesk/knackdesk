const SITE = "https://knackdesk.com";

export function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function adsense(id) {
  if (!id) return "";
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${escapeHtml(id)}" crossorigin="anonymous"></script>`;
}

export function renderPage({ title, description, body, path, adsenseId = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Knackdesk</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${SITE}${path}">
<link rel="stylesheet" href="/styles.css">
${adsense(adsenseId)}
</head>
<body>
<header class="top"><a class="brand" href="/">Knackdesk</a><nav><a href="/about/">About</a><a href="/contact/">Contact</a></nav></header>
<main>
${body}
</main>
<footer><span>© Knackdesk</span><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></footer>
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
