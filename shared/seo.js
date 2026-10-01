export const SITE = "https://knackdesk.com";
export const ORG_ID = `${SITE}/#organization`;
export const OG_IMAGE = `${SITE}/og.png`;

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", times: "×", divide: "÷", minus: "−",
  ndash: "–", mdash: "—", hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", rarr: "→", middot: "·", euro: "€", pound: "£",
};

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

export function htmlToText(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Knackdesk",
    url: SITE,
    logo: `${SITE}/icon.svg`,
    contactPoint: { "@type": "ContactPoint", email: "hello@knackdesk.com", contactType: "customer support" },
  };
}

export function websiteNode() {
  return { "@type": "WebSite", "@id": `${SITE}/#website`, name: "Knackdesk", url: SITE, publisher: { "@id": ORG_ID } };
}

export function breadcrumbNode({ name, path, parent }) {
  const trail = [{ name: "Home", path: "/" }, ...(parent ? [parent] : []), { name, path }];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: `${SITE}${t.path}` })),
  };
}

export function collectionPageNode({ name, description, path, items }) {
  return {
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE}${path}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: `${SITE}${it.path}` })),
    },
  };
}

export function webApplicationNode({ name, path, description }) {
  return {
    "@type": "WebApplication",
    name,
    url: `${SITE}${path}`,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    isAccessibleForFree: true,
    provider: { "@id": ORG_ID },
  };
}

export function productNode({ name, description, price_cents, polar_url }, image = null) {
  return {
    "@type": "Product",
    ...(image ? { image } : {}),
    name,
    description,
    offers: {
      "@type": "Offer",
      price: (price_cents / 100).toFixed(2),
      priceCurrency: "USD",
      url: polar_url,
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
  };
}

function faqSection(html) {
  const start = html.search(/<h2[^>]*>\s*Frequently asked questions\s*<\/h2>/i);
  if (start < 0) return "";
  const rest = html.slice(start).replace(/^<h2[^>]*>[\s\S]*?<\/h2>/i, "");
  const end = rest.search(/<h2[\s>]/i);
  return end < 0 ? rest : rest.slice(0, end);
}

export function extractFaq(html) {
  const section = faqSection(html);
  return [...section.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(([, q, a]) => ({ question: htmlToText(q), answer: htmlToText(a) }))
    .filter(({ question, answer }) => question && answer);
}

export function faqPageNode(html) {
  const faq = extractFaq(html);
  if (faq.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
  };
}

export function renderJsonLd(nodes) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/<\/script/gi, "<\\/script");
  return `<script type="application/ld+json">${json}</script>`;
}
