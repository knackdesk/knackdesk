import { describe, it, expect } from "vitest";
import { renderPage, renderProductCards } from "./layout.js";

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
