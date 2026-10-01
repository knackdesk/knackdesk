import { describe, it, expect } from "vitest";
import { renderPage, renderProductCards, renderCatalogSections } from "./layout.js";
import { extractFaq, faqPageNode, webApplicationNode, productNode } from "./seo.js";

const ldGraph = (html) => {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  expect(scripts).toHaveLength(1);
  const json = JSON.parse(scripts[0][1]);
  expect(json["@context"]).toBe("https://schema.org");
  return json["@graph"];
};
const types = (graph) => graph.map((n) => n["@type"]);

describe("renderPage", () => {
  it("wraps body with nav, footer, canonical and title", () => {
    const html = renderPage({ title: "About", description: "d", body: "<p>x</p>", path: "/about/" });
    expect(html).toContain("<title>About · Knackdesk</title>");
    expect(html).toContain('<link rel="canonical" href="https://knackdesk.com/about/">');
    expect(html).toContain("<p>x</p>");
    expect(html).toContain('href="/privacy/"');
    expect(html).not.toContain("adsbygoogle");
  });
  it("never mentions the parent company", () => {
    const html = renderPage({ title: "T", description: "d", body: "", path: "/" });
    expect(html).not.toMatch(/smitheo/i);
  });
  it("carries the not-advice disclaimer in the footer", () => {
    const html = renderPage({ title: "T", description: "d", body: "", path: "/" });
    expect(html).toContain("not legal, tax or financial advice");
  });
  it("adds the AdSense tag only when an id is given", () => {
    const html = renderPage({ title: "T", description: "d", body: "", path: "/", adsenseId: "ca-pub-1" });
    expect(html).toContain("client=ca-pub-1");
  });
  it("escapes title and description", () => {
    const html = renderPage({ title: "<b>", description: '"q"', body: "", path: "/" });
    expect(html).toContain("&lt;b&gt;");
    expect(html).toContain("&quot;q&quot;");
  });
});

describe("renderProductCards", () => {
  it("links tools to /slug/ and digital products to polar_url", () => {
    const html = renderProductCards([
      { data: { slug: "a", name: "A", lane: "tool", tagline: "t1" } },
      { data: { slug: "b", name: "B", lane: "digital", tagline: "t2", polar_url: "https://polar.sh/x" } },
    ]);
    expect(html).toContain('href="/a/"');
    expect(html).toContain('href="https://polar.sh/x"');
    expect(html).toContain("t2");
  });
});

describe("renderPage SEO head", () => {
  const page = (o = {}) => renderPage({ title: "Late Fee", description: "Late fee maths", body: "<p>x</p>", path: "/late/", ...o });
  it("emits Open Graph and Twitter tags", () => {
    const html = page();
    expect(html).toContain('<meta property="og:type" content="website">');
    expect(html).toContain('<meta property="og:title" content="Late Fee">');
    expect(html).toContain('<meta property="og:description" content="Late fee maths">');
    expect(html).toContain('<meta property="og:url" content="https://knackdesk.com/late/">');
    expect(html).toContain('<meta property="og:site_name" content="Knackdesk">');
    expect(html).toContain('<meta property="og:image" content="https://knackdesk.com/og.png">');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
    expect(html).toContain('<meta name="twitter:title" content="Late Fee">');
    expect(html).toContain('<meta name="twitter:description" content="Late fee maths">');
    expect(html).toContain('<meta name="twitter:image" content="https://knackdesk.com/og.png">');
  });
  it("uses og:type article when asked", () => {
    expect(page({ ogType: "article" })).toContain('<meta property="og:type" content="article">');
  });
  it("links icons and sets robots", () => {
    const html = page();
    expect(html).toContain('<link rel="icon" href="/icon.svg">');
    expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">');
    expect(html).toContain('<meta name="robots" content="index,follow,max-image-preview:large">');
  });
  it("lets a headline override <title> and og:title but not the body", () => {
    const html = page({ headline: "Late Fee Calculator: Flat or Monthly", body: "<h1>Late Fee</h1>" });
    expect(html).toContain("<title>Late Fee Calculator: Flat or Monthly</title>");
    expect(html).toContain('<meta property="og:title" content="Late Fee Calculator: Flat or Monthly">');
    expect(html).toContain('<meta name="twitter:title" content="Late Fee Calculator: Flat or Monthly">');
    expect(html).toContain("<h1>Late Fee</h1>");
  });
  it("puts Organization and WebSite in the home page graph, without breadcrumbs", () => {
    const graph = ldGraph(renderPage({ title: "Home", description: "d", body: "", path: "/" }));
    expect(types(graph)).toEqual(expect.arrayContaining(["Organization", "WebSite"]));
    expect(types(graph)).not.toContain("BreadcrumbList");
    const org = graph.find((n) => n["@type"] === "Organization");
    expect(org).toMatchObject({ name: "Knackdesk", url: "https://knackdesk.com", logo: "https://knackdesk.com/icon.svg" });
    expect(org.contactPoint.email).toBe("hello@knackdesk.com");
  });
  it("adds a Home → page BreadcrumbList on other pages and no WebSite node", () => {
    const graph = ldGraph(page());
    expect(types(graph)).toContain("Organization");
    expect(types(graph)).not.toContain("WebSite");
    const bc = graph.find((n) => n["@type"] === "BreadcrumbList");
    expect(bc.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://knackdesk.com/" },
      { "@type": "ListItem", position: 2, name: "Late Fee", item: "https://knackdesk.com/late/" },
    ]);
  });
  it("appends extra schema nodes and escapes </script> inside strings", () => {
    const html = page({ schema: [{ "@type": "Thing", name: "a </script><b>" }] });
    expect(html).not.toContain("a </script>");
    const graph = ldGraph(html);
    expect(graph.find((n) => n["@type"] === "Thing").name).toBe("a </script><b>");
  });
});

describe("structured data helpers", () => {
  const faqHtml = `<h1>T</h1><h2>How it works</h2><h3>Not a question</h3><p>ignore me</p>
<h2>Frequently asked questions</h2>
<h3>Does net 30 include the <em>invoice</em> date?</h3>
<p>No. Day one is the day after &amp; see the <a href="/x/">late fee tool</a>.</p>
<h3>Is my data stored?</h3>
<p>No. It&#39;s all &quot;local&quot;.</p>
<h2>Related tools</h2><h3>Stray</h3><p>stray</p>`;
  it("extracts FAQ pairs from the FAQ section only, stripping tags and decoding entities", () => {
    expect(extractFaq(faqHtml)).toEqual([
      { question: "Does net 30 include the invoice date?", answer: "No. Day one is the day after & see the late fee tool." },
      { question: "Is my data stored?", answer: "No. It's all \"local\"." },
    ]);
  });
  it("returns no FAQ when the section is absent", () => {
    expect(extractFaq("<h1>x</h1><h3>q</h3><p>a</p>")).toEqual([]);
    expect(faqPageNode("<h1>x</h1>")).toBeNull();
  });
  it("builds a FAQPage node", () => {
    const node = faqPageNode(faqHtml);
    expect(node["@type"]).toBe("FAQPage");
    expect(node.mainEntity[0]).toEqual({ "@type": "Question", name: "Does net 30 include the invoice date?", acceptedAnswer: { "@type": "Answer", text: "No. Day one is the day after & see the late fee tool." } });
  });
  it("builds a free WebApplication node", () => {
    const node = webApplicationNode({ name: "VAT Calculator", path: "/vat/", description: "Add VAT" });
    expect(node).toMatchObject({
      "@type": "WebApplication", name: "VAT Calculator", url: "https://knackdesk.com/vat/", description: "Add VAT",
      applicationCategory: "BusinessApplication", operatingSystem: "Any", isAccessibleForFree: true,
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    });
    expect(node.provider["@id"]).toBe("https://knackdesk.com/#organization");
  });
  it("builds a Product node for a kit", () => {
    const node = productNode({ name: "Kit", description: "A kit", price_cents: 1200, polar_url: "https://buy.polar.sh/k" });
    expect(node).toMatchObject({ "@type": "Product", name: "Kit", description: "A kit" });
    expect(node.offers).toMatchObject({ "@type": "Offer", price: "12.00", priceCurrency: "USD", url: "https://buy.polar.sh/k", availability: "https://schema.org/InStock" });
    expect(node.offers.seller["@id"]).toBe("https://knackdesk.com/#organization");
  });
});

describe("renderCatalogSections", () => {
  const items = [
    { data: { slug: "vat", name: "VAT", lane: "tool", category: "invoicing", tagline: "vat" } },
    { data: { slug: "hours", name: "Hours", lane: "tool", category: "time", tagline: "hours" } },
    { data: { slug: "rate", name: "Rate", lane: "tool", category: "pricing", tagline: "rate" } },
    { data: { slug: "kit", name: "Kit", lane: "digital", tagline: "kit", polar_url: "https://polar.sh/k", price_cents: 900 } },
  ];
  it("groups tools by category in a fixed order with intros, and kits last", () => {
    const html = renderCatalogSections(items);
    const order = ["Invoicing &amp; payment", "Rates &amp; pricing", "Time &amp; pay", "Kits"].map((h) => html.indexOf(`<h2>${h}</h2>`));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html).not.toContain("<h2>Planning &amp; cash</h2>");
    const inv = html.slice(order[0], order[1]);
    expect(inv).toContain('href="/vat/"');
    expect(inv).toContain('<p class="category-intro">');
    const kits = html.slice(order[3]);
    expect(kits).toContain('href="https://polar.sh/k"');
    expect(kits).toContain("$9");
    expect(kits).not.toContain('href="/vat/"');
  });
});
