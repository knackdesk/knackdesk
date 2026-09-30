# Knackdesk Factory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Knackdesk monorepo: static brand site, GitHub Pages deploy, pipeline docs, and Node scripts that create Polar listings, pull sales into a ledger, and set Cloudflare DNS, so every later product only needs a folder under `products/`.

**Architecture:** Static-first monorepo. `scripts/lib/*` holds small pure modules (front-matter parsing, catalog loading, HTML rendering, API clients) that are unit-tested with mocked `fetch`; `scripts/*.js` are thin CLIs over them. GitHub Actions runs tests, builds `dist/`, and deploys to Pages. No servers or databases anywhere.

**Tech Stack:** Node 20 (ESM), npm workspaces, Vitest, plain HTML/CSS/JS, GitHub Actions, Polar.sh REST API, Cloudflare DNS API.

**Spec:** `docs/superpowers/specs/2026-09-30-knackdesk-passive-income-factory-design.md`

## Global Constraints

- Node 20 or newer; all code is ESM (`"type": "module"`).
- Zero paid infrastructure: GitHub free tier, Polar Starter plan, Cloudflare free DNS only.
- Brand name is `Knackdesk` everywhere; never the company name.
- Secrets only in `.env` (git-ignored); every script calls `requireEnv()` before network calls.
- Files under 400 lines; functions under 50 lines.
- Every product folder is self-contained; only `shared/` may be imported across products.
- All external HTTP goes through `scripts/lib/http.js` so tests can mock one function.
- Scripts are idempotent: re-running never creates duplicate Polar products, benefits or DNS records.

## Review Focus

1. `PLAN.md` front-matter with a price like `"9.99"` (string, dollars) must be rejected, not silently sent to Polar as 9 cents. Test in Task 4.
2. A product folder without `PLAN.md` or with `status: draft` must be skipped by the site build and by the Polar script, not crash them. Test in Task 4 and Task 7.
3. A Polar API 4xx response must surface the body message and exit non-zero, never print "created". Test in Task 7.
4. `polar-sales.js` on an empty orders list must leave ledger rows intact with zero units, not delete them. Test in Task 8.
5. Cloudflare records that already exist with the right content must be left alone (no duplicate A records). Test in Task 9.

---

### Task 1: Toolchain

**Files:**
- Create: `.nvmrc`

**Interfaces:**
- Produces: `node` >= 20 on PATH via nvm, `gh` CLI installed.

- [ ] **Step 1: Install Node 20 with nvm and GitHub CLI with Homebrew**

```bash
source ~/.nvm/nvm.sh && nvm install 20 && nvm alias default 20 && node -v
brew install gh && gh --version
```

Expected: `v20.x.x` printed; `gh version 2.x` printed.

- [ ] **Step 2: Pin Node for the project**

```bash
echo "20" > .nvmrc
```

- [ ] **Step 3: Commit**

```bash
git add .nvmrc && git commit -m "chore: pin node 20"
```

---

### Task 2: Repo scaffold and env validation

**Files:**
- Create: `package.json`, `.gitignore`, `.env.example`, `vitest.config.js`, `README.md`
- Create: `scripts/lib/env.js`, `scripts/check-env.js`
- Test: `scripts/lib/env.test.js`

**Interfaces:**
- Produces: `requireEnv(names: string[], source = process.env): Record<string,string>` — throws `Error("Missing env: A, B")` listing every missing name.
- Produces: `loadDotEnv(path = ".env")` — reads KEY=value lines into `process.env` without overriding existing values.

- [ ] **Step 1: Create package.json, .gitignore, .env.example, vitest config**

`package.json`:
```json
{
  "name": "knackdesk",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "workspaces": ["products/*"],
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "node scripts/build-site.js",
    "check-env": "node scripts/check-env.js",
    "polar:create": "node scripts/polar-create-product.js",
    "polar:sales": "node scripts/polar-sales.js",
    "dns": "node scripts/cloudflare-dns.js"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

`.gitignore`:
```
node_modules/
dist/
.env
.DS_Store
products/*/dist.zip
```

`.env.example`:
```
# GitHub fine-grained PAT: contents, pages, workflows on knackdesk org repos
GITHUB_TOKEN=
# Polar.sh organization access token and organization id
POLAR_ACCESS_TOKEN=
POLAR_ORG_ID=
# Cloudflare token scoped to DNS:Edit on the knackdesk.com zone
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ZONE_ID=
# Public AdSense publisher id, e.g. ca-pub-1234567890123456 (leave empty until approved)
ADSENSE_CLIENT_ID=
# Gumroad fallback only
GUMROAD_ACCESS_TOKEN=
```

`vitest.config.js`:
```js
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: { include: ["scripts/**/*.test.js", "shared/**/*.test.js", "products/*/test/**/*.test.js"] },
});
```

- [ ] **Step 2: Install dependencies**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && npm install
```

Expected: `node_modules/vitest` exists; `package-lock.json` created.

- [ ] **Step 3: Write the failing test**

`scripts/lib/env.test.js`:
```js
import { describe, it, expect } from "vitest";
import { requireEnv } from "./env.js";

describe("requireEnv", () => {
  it("returns the requested values when all present", () => {
    const out = requireEnv(["A", "B"], { A: "1", B: "2", C: "3" });
    expect(out).toEqual({ A: "1", B: "2" });
  });
  it("throws listing every missing or empty name", () => {
    expect(() => requireEnv(["A", "B", "C"], { A: "1", B: "" })).toThrow("Missing env: B, C");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run scripts/lib/env.test.js`
Expected: FAIL, cannot find module `./env.js`.

- [ ] **Step 5: Implement env.js and check-env.js**

`scripts/lib/env.js`:
```js
export function requireEnv(names, source = process.env) {
  const missing = names.filter((n) => !source[n] || source[n].trim() === "");
  if (missing.length > 0) throw new Error(`Missing env: ${missing.join(", ")}`);
  return Object.fromEntries(names.map((n) => [n, source[n]]));
}

export async function loadDotEnv(path = ".env") {
  const fs = await import("node:fs");
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
```

`scripts/check-env.js`:
```js
import { loadDotEnv, requireEnv } from "./lib/env.js";

const GROUPS = {
  github: ["GITHUB_TOKEN"],
  polar: ["POLAR_ACCESS_TOKEN", "POLAR_ORG_ID"],
  cloudflare: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID"],
};

await loadDotEnv();
let failed = false;
for (const [group, names] of Object.entries(GROUPS)) {
  try {
    requireEnv(names);
    console.log(`ok       ${group}`);
  } catch (err) {
    failed = true;
    console.log(`missing  ${group}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run scripts/lib/env.test.js`
Expected: 2 passed.

- [ ] **Step 7: Write README.md**

```markdown
# Knackdesk

Small, useful tools and kits. This monorepo holds the brand site, every product, and the scripts that ship them.

- `site/` brand site pages
- `products/<slug>/` one folder per product (see `pipeline/LAUNCH-CHECKLIST.md`)
- `pipeline/` backlog, scoring rubric, ledger
- `scripts/` build, deploy, Polar and Cloudflare automation

Setup: copy `.env.example` to `.env`, fill tokens, run `npm run check-env`.
Design spec: `docs/superpowers/specs/2026-09-30-knackdesk-passive-income-factory-design.md`
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore .env.example vitest.config.js README.md scripts
git commit -m "chore: scaffold monorepo with env validation"
```

---

### Task 3: Pipeline documents

**Files:**
- Create: `pipeline/SCORING.md`, `pipeline/LAUNCH-CHECKLIST.md`, `pipeline/BACKLOG.md`, `pipeline/LEDGER.md`

**Interfaces:**
- Produces: `LEDGER.md` table with exact header `| slug | lane | launched | url | price_usd | units | gross_usd | net_usd |` consumed by Task 8.

- [ ] **Step 1: Write SCORING.md**

```markdown
# Idea Scoring Rubric

Score each idea 1–5 per axis. Total out of 25. Ship threshold: 16.

| Axis | 5 | 1 |
|---|---|---|
| Demand evidence | Multiple independent signals of people paying or searching now | A hunch |
| Competition gap | Few or poor incumbents, clear angle | Saturated with strong free options |
| Build effort | Under one loop turn | Multiple turns |
| Maintenance | None after launch | Needs updates, data feeds or support |
| Monetization fit | Clear price point or proven ad/affiliate category | Unclear how it earns |

Hard filters (fail any = reject): needs a server or database; needs user accounts; scrapes third-party data at runtime; gives medical, legal or financial advice; violates Polar, AdSense or Chrome Web Store policy.
```

- [ ] **Step 2: Write LAUNCH-CHECKLIST.md**

```markdown
# Launch Checklist (copy into products/<slug>/LAUNCH.md)

- [ ] PLAN.md front-matter complete (slug, name, lane, price_cents, status, tagline, description)
- [ ] Tests written first and passing (`npm test`)
- [ ] code-reviewer agent: no CRITICAL/HIGH open
- [ ] security-reviewer agent: no CRITICAL/HIGH open
- [ ] LICENSES.md lists every third-party asset/library (MIT/CC0 only)
- [ ] Deliverable built (`assets/*.zip` for kits, `public/` for tools, `dist.zip` for extensions)
- [ ] Cover image generated and saved to `assets/cover.png`
- [ ] Pushed to main; deploy workflow green
- [ ] Polar listing created (`npm run polar:create -- <slug>`), URL recorded below
- [ ] Row added to pipeline/LEDGER.md
- [ ] Status message sent to owner

Live URL:
Polar URL:
```

- [ ] **Step 3: Write BACKLOG.md and LEDGER.md templates**

`pipeline/BACKLOG.md`:
```markdown
# Idea Backlog

Status: candidate | planned | shipped | rejected

| id | idea | lane | demand | gap | effort | maint | money | total | status | sources |
|---|---|---|---|---|---|---|---|---|---|---|
```

`pipeline/LEDGER.md`:
```markdown
# Ledger

Refreshed by `npm run polar:sales`. Amounts in USD.

| slug | lane | launched | url | price_usd | units | gross_usd | net_usd |
|---|---|---|---|---|---|---|---|
```

- [ ] **Step 4: Commit**

```bash
git add pipeline && git commit -m "docs: add scoring rubric, launch checklist, backlog and ledger"
```

---

### Task 4: Front-matter parser and product catalog

**Files:**
- Create: `scripts/lib/frontmatter.js`, `scripts/lib/catalog.js`
- Test: `scripts/lib/frontmatter.test.js`, `scripts/lib/catalog.test.js`

**Interfaces:**
- Produces: `parseFrontmatter(text: string): { data: object, body: string }` — data values: unquoted numbers become Number, `true/false` become booleans, everything else string with surrounding quotes stripped.
- Produces: `validateProduct(data: object): object` — returns the same object or throws `Error` naming the bad field. Required: `slug` (kebab-case), `name` (3–64 chars), `lane` in `digital|tool|extension`, `status` in `draft|live`, `tagline`, `description`. `price_cents` required when `lane === "digital"` and must be an integer.
- Produces: `loadCatalog(rootDir: string): Promise<Array<{ dir: string, data: object, body: string }>>` — one entry per `products/*/PLAN.md` with `status: live`, sorted by folder name; folders without `PLAN.md` are skipped with a console warning; invalid front-matter throws.

- [ ] **Step 1: Write the failing front-matter tests**

`scripts/lib/frontmatter.test.js`:
```js
import { describe, it, expect } from "vitest";
import { parseFrontmatter, validateProduct } from "./frontmatter.js";

const doc = `---
slug: budget-kit
name: "Budget Kit"
lane: digital
price_cents: 900
status: live
tagline: A calm monthly budget
description: Spreadsheet plus guide.
---
# Plan
body here`;

describe("parseFrontmatter", () => {
  it("parses typed values and body", () => {
    const { data, body } = parseFrontmatter(doc);
    expect(data.slug).toBe("budget-kit");
    expect(data.name).toBe("Budget Kit");
    expect(data.price_cents).toBe(900);
    expect(body.trim()).toBe("# Plan\nbody here");
  });
  it("returns empty data when no front-matter", () => {
    expect(parseFrontmatter("just text").data).toEqual({});
  });
});

describe("validateProduct", () => {
  const good = parseFrontmatter(doc).data;
  it("accepts a valid product", () => {
    expect(validateProduct(good)).toBe(good);
  });
  it("rejects a dollar-string price", () => {
    expect(() => validateProduct({ ...good, price_cents: "9.99" })).toThrow(/price_cents/);
  });
  it("rejects a fractional price", () => {
    expect(() => validateProduct({ ...good, price_cents: 9.99 })).toThrow(/price_cents/);
  });
  it("rejects an unknown lane", () => {
    expect(() => validateProduct({ ...good, lane: "saas" })).toThrow(/lane/);
  });
  it("rejects a non-kebab slug", () => {
    expect(() => validateProduct({ ...good, slug: "Budget Kit" })).toThrow(/slug/);
  });
  it("does not require price for tools", () => {
    const { price_cents, ...tool } = { ...good, lane: "tool" };
    expect(validateProduct(tool)).toBe(tool);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run scripts/lib/frontmatter.test.js`
Expected: FAIL, cannot find module.

- [ ] **Step 3: Implement frontmatter.js**

```js
const LANES = ["digital", "tool", "extension"];
const STATUSES = ["draft", "live"];

function coerce(raw) {
  const trimmed = raw.trim();
  const quoted = /^["'].*["']$/.test(trimmed);
  const v = trimmed.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  if (quoted) return v;
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) data[kv[1]] = coerce(kv[2]);
  }
  return { data, body: m[2] };
}

function fail(field, why) {
  throw new Error(`Invalid PLAN.md front-matter: ${field} ${why}`);
}

export function validateProduct(data) {
  if (typeof data.slug !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) fail("slug", "must be kebab-case");
  if (typeof data.name !== "string" || data.name.length < 3 || data.name.length > 64) fail("name", "must be 3-64 chars");
  if (!LANES.includes(data.lane)) fail("lane", `must be one of ${LANES.join("|")}`);
  if (!STATUSES.includes(data.status)) fail("status", `must be one of ${STATUSES.join("|")}`);
  if (typeof data.tagline !== "string" || !data.tagline) fail("tagline", "is required");
  if (typeof data.description !== "string" || !data.description) fail("description", "is required");
  if (data.lane === "digital" && !Number.isInteger(data.price_cents)) fail("price_cents", "must be an integer number of cents");
  return data;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run scripts/lib/frontmatter.test.js`
Expected: 8 passed.

- [ ] **Step 5: Write the failing catalog test**

`scripts/lib/catalog.test.js`:
```js
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadCatalog } from "./catalog.js";

const plan = (slug, status) => `---
slug: ${slug}
name: ${slug} name
lane: tool
status: ${status}
tagline: t
description: d
---
body`;

let root;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "kd-"));
  mkdirSync(join(root, "products", "alpha"), { recursive: true });
  mkdirSync(join(root, "products", "beta"), { recursive: true });
  mkdirSync(join(root, "products", "noplan"), { recursive: true });
  writeFileSync(join(root, "products", "alpha", "PLAN.md"), plan("alpha", "live"));
  writeFileSync(join(root, "products", "beta", "PLAN.md"), plan("beta", "draft"));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("loadCatalog", () => {
  it("returns only live products with PLAN.md, sorted by slug", async () => {
    const items = await loadCatalog(root);
    expect(items.map((i) => i.data.slug)).toEqual(["alpha"]);
    expect(items[0].dir).toBe(join(root, "products", "alpha"));
  });
  it("throws on invalid front-matter", async () => {
    writeFileSync(join(root, "products", "alpha", "PLAN.md"), plan("Bad Slug", "live"));
    await expect(loadCatalog(root)).rejects.toThrow(/slug/);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run scripts/lib/catalog.test.js`
Expected: FAIL, cannot find module.

- [ ] **Step 7: Implement catalog.js**

```js
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter, validateProduct } from "./frontmatter.js";

export async function loadCatalog(rootDir) {
  const productsDir = join(rootDir, "products");
  if (!existsSync(productsDir)) return [];
  const entries = readdirSync(productsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  const items = [];
  for (const name of entries) {
    const dir = join(productsDir, name);
    const planPath = join(dir, "PLAN.md");
    if (!existsSync(planPath)) {
      console.warn(`skip ${name}: no PLAN.md`);
      continue;
    }
    const { data, body } = parseFrontmatter(readFileSync(planPath, "utf8"));
    validateProduct(data);
    if (data.status !== "live") continue;
    items.push({ dir, data, body });
  }
  return items;
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npx vitest run scripts/lib`
Expected: all passed.

- [ ] **Step 9: Commit**

```bash
git add scripts/lib && git commit -m "feat: add PLAN.md front-matter parser and product catalog loader"
```

---

### Task 5: Site layout and build

**Files:**
- Create: `shared/layout.js`, `shared/styles.css`
- Create: `site/CNAME`, `site/pages/index.html`, `site/pages/about.html`, `site/pages/privacy.html`, `site/pages/terms.html`, `site/pages/contact.html`
- Create: `scripts/build-site.js`
- Test: `shared/layout.test.js`, `scripts/build-site.test.js`

**Interfaces:**
- Consumes: `loadCatalog(rootDir)` from Task 4.
- Produces: `escapeHtml(s): string`.
- Produces: `renderPage({ title, description, body, path, adsenseId? }): string` — full HTML document with nav, footer, canonical URL `https://knackdesk.com${path}`, and AdSense script tag only when `adsenseId` is non-empty.
- Produces: `renderProductCards(items): string` — `<ul class="cards">` with one `<li>` per catalog item linking to `/<slug>/` for tools and extensions, and to `data.polar_url` for digital products.
- Produces: `buildSite({ rootDir, outDir, adsenseId }): Promise<number>` — writes `outDir/index.html`, one folder per `site/pages/*.html`, copies `products/<slug>/public/**` to `outDir/<slug>/`, copies `site/CNAME` and `shared/styles.css`; returns live product count.

- [ ] **Step 1: Write the failing layout tests**

`shared/layout.test.js`:
```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run shared`
Expected: FAIL, cannot find module.

- [ ] **Step 3: Implement layout.js and styles.css**

`shared/layout.js`:
```js
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
```

`shared/styles.css`:
```css
:root{--bg:#fbfaf7;--fg:#1d1d1b;--muted:#6b6b66;--accent:#0f6b5c;--card:#fff;--line:#e6e3dc}
@media(prefers-color-scheme:dark){:root{--bg:#141413;--fg:#f1efe9;--muted:#a3a29b;--accent:#5fd3b9;--card:#1d1d1b;--line:#2c2c29}}
*{box-sizing:border-box}body{margin:0;font:16px/1.6 system-ui,sans-serif;background:var(--bg);color:var(--fg)}
.top,footer{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1rem 16px;max-width:960px;margin:0 auto}
.top nav a,footer a{margin-left:1rem;color:var(--muted);text-decoration:none}.brand{font-weight:700;text-decoration:none;color:var(--fg)}
main{max-width:960px;margin:0 auto;padding:1rem 16px 4rem}h1{font-size:2rem;line-height:1.2}
.cards{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}
.cards a{display:block;padding:1rem;background:var(--card);border:1px solid var(--line);border-radius:12px;color:inherit;text-decoration:none}
.cards strong{display:block;margin-bottom:.25rem}.cards span{color:var(--muted)}
.tool{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:1.5rem;margin:1.5rem 0}
input,select,textarea,button{font:inherit;padding:.5rem .75rem;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--fg)}
button.primary{background:var(--accent);color:#fff;border-color:var(--accent);cursor:pointer}
```

- [ ] **Step 4: Run layout tests**

Run: `npx vitest run shared`
Expected: 4 passed.

- [ ] **Step 5: Write site pages and CNAME**

`site/CNAME`:
```
knackdesk.com
```

`site/pages/index.html` (the build replaces `<!--PRODUCTS-->`):
```html
<!-- title: Small, useful tools and kits -->
<!-- description: Knackdesk makes single-purpose web tools and practical digital kits. No accounts, no tracking, no fluff. -->
<h1>Small, useful tools and kits</h1>
<p>Single-purpose tools that run in your browser and practical kits you can download once and keep.</p>
<!--PRODUCTS-->
```

`site/pages/about.html`:
```html
<!-- title: About -->
<!-- description: Who makes Knackdesk and why. -->
<h1>About Knackdesk</h1>
<p>Knackdesk is a small independent studio. We build focused tools that do one job well and run entirely in your browser, plus downloadable kits for everyday planning and work.</p>
<p>Every tool is free to use. Kits are sold through Polar, which handles payment, tax and delivery. Nothing you type into a tool leaves your device.</p>
<p>Questions or a tool you wish existed? See the <a href="/contact/">contact page</a>.</p>
```

`site/pages/contact.html`:
```html
<!-- title: Contact -->
<!-- description: How to reach Knackdesk. -->
<h1>Contact</h1>
<p>Email <a href="mailto:hello@knackdesk.com">hello@knackdesk.com</a>. We read everything and reply to purchase questions within a few days.</p>
```

`site/pages/privacy.html`:
```html
<!-- title: Privacy Policy -->
<!-- description: Knackdesk privacy policy. -->
<h1>Privacy Policy</h1>
<p>Last updated: 2026-09-30.</p>
<p>Our tools run in your browser. We do not receive, store or transmit what you enter into them.</p>
<p>We use Cloudflare Web Analytics, a cookie-less service that records page views without identifying you.</p>
<p>Some pages show advertising served by Google AdSense. Google may use cookies to serve ads based on your visits to this and other sites. You can opt out at <a href="https://www.google.com/settings/ads">Google Ads Settings</a>.</p>
<p>Purchases are processed by Polar (polar.sh), which is the merchant of record and holds your order and payment details under its own privacy policy. We receive your email address to deliver the product and answer support requests only.</p>
<p>Contact: <a href="mailto:hello@knackdesk.com">hello@knackdesk.com</a>.</p>
```

`site/pages/terms.html`:
```html
<!-- title: Terms of Use -->
<!-- description: Knackdesk terms of use. -->
<h1>Terms of Use</h1>
<p>Last updated: 2026-09-30.</p>
<p>Tools are provided as is, without warranty. Check results before relying on them for anything important.</p>
<p>Digital kits are licensed for personal or single-business use. Do not resell or redistribute them. Refunds are handled by Polar under its refund policy.</p>
<p>These terms are governed by the laws of the seller's country of establishment as shown on your Polar receipt.</p>
```

- [ ] **Step 6: Write the failing build test**

`scripts/build-site.test.js`:
```js
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite } from "./build-site.js";

let root, out;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "kd-"));
  out = join(root, "dist");
  cpSync(new URL("../site", import.meta.url), join(root, "site"), { recursive: true });
  cpSync(new URL("../shared", import.meta.url), join(root, "shared"), { recursive: true });
  mkdirSync(join(root, "products", "conv", "public"), { recursive: true });
  writeFileSync(join(root, "products", "conv", "public", "index.html"), "<h1>conv</h1>");
  writeFileSync(join(root, "products", "conv", "PLAN.md"), `---
slug: conv
name: Converter
lane: tool
status: live
tagline: converts
description: d
---`);
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("buildSite", () => {
  it("writes index, pages, product folders, CNAME and styles", async () => {
    await buildSite({ rootDir: root, outDir: out, adsenseId: "" });
    const index = readFileSync(join(out, "index.html"), "utf8");
    expect(index).toContain('href="/conv/"');
    expect(index).toContain("<title>Small, useful tools and kits · Knackdesk</title>");
    expect(existsSync(join(out, "about", "index.html"))).toBe(true);
    expect(readFileSync(join(out, "conv", "index.html"), "utf8")).toBe("<h1>conv</h1>");
    expect(readFileSync(join(out, "CNAME"), "utf8").trim()).toBe("knackdesk.com");
    expect(existsSync(join(out, "styles.css"))).toBe(true);
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npx vitest run scripts/build-site.test.js`
Expected: FAIL, cannot find module.

- [ ] **Step 8: Implement build-site.js**

```js
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

export async function buildSite({ rootDir, outDir, adsenseId = "" }) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const items = await loadCatalog(rootDir);
  const cards = renderProductCards(items);
  const pagesDir = join(rootDir, "site", "pages");
  for (const file of readdirSync(pagesDir).filter((f) => f.endsWith(".html"))) {
    const raw = readFileSync(join(pagesDir, file), "utf8");
    const name = basename(file, ".html");
    const path = name === "index" ? "/" : `/${name}/`;
    const body = raw.replace("<!--PRODUCTS-->", cards);
    writePage(outDir, path, renderPage({ title: pageMeta(raw, "title"), description: pageMeta(raw, "description"), body, path, adsenseId }));
  }
  for (const { dir, data } of items) {
    const pub = join(dir, "public");
    if (existsSync(pub)) cpSync(pub, join(outDir, data.slug), { recursive: true });
  }
  cpSync(join(rootDir, "site", "CNAME"), join(outDir, "CNAME"));
  cpSync(join(rootDir, "shared", "styles.css"), join(outDir, "styles.css"));
  return items.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rootDir = process.cwd();
  const count = await buildSite({ rootDir, outDir: join(rootDir, "dist"), adsenseId: process.env.ADSENSE_CLIENT_ID || "" });
  console.log(`built site with ${count} live products`);
}
```

- [ ] **Step 9: Run all tests and a real build**

Run: `npx vitest run && npm run build && ls dist`
Expected: all tests pass; `dist/` contains `index.html about contact privacy terms CNAME styles.css`.

- [ ] **Step 10: Commit**

```bash
git add shared site scripts/build-site.js scripts/build-site.test.js
git commit -m "feat: brand site layout, legal pages and static build"
```

---

### Task 6: GitHub Pages deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm test`, `npm run build` from Tasks 2 and 5.
- Produces: site deployed to GitHub Pages on every push to `main`.

- [ ] **Step 1: Write deploy.yml**

```yaml
name: deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
        env:
          ADSENSE_CLIENT_ID: ${{ vars.ADSENSE_CLIENT_ID }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Sanity-check the file**

Run: `grep -c "deploy-pages@v4" .github/workflows/deploy.yml`
Expected: `1`.

- [ ] **Step 3: Commit**

```bash
git add .github && git commit -m "ci: deploy site to GitHub Pages on push to main"
```

---

### Task 7: Polar client and product creation script

**Files:**
- Create: `scripts/lib/http.js`, `scripts/lib/polar.js`, `scripts/polar-create-product.js`
- Test: `scripts/lib/polar.test.js`

**Interfaces:**
- Produces: `http.js`: `request(url, { method, headers, body, raw, fetchImpl }): Promise<{ status, json, headers }>` — JSON-encodes `body` unless `raw` is set; throws `HttpError` (has `.status`, `.body`) on status >= 400 with message `"<METHOD> <url> -> <status>: <body text>"`.
- Produces: `polar.js` exported factory `createPolarClient({ token, orgId, fetchImpl })` returning:
  - `listAllProducts()` → all products of the org (follows pagination).
  - `findProductBySlug(slug)` → product object or `null` (matches `metadata.slug`).
  - `upsertProduct({ slug, name, description, priceCents })` → product; creates when absent, else `PATCH /v1/products/{id}` with name/description.
  - `uploadFile({ name, buffer, mimeType })` → file id (single-part upload).
  - `createDownloadableBenefit({ description, fileIds })` → benefit id.
  - `attachBenefits(productId, benefitIds)` → void.
  - `listOrders()` → all orders of the org (follows pagination).
- CLI: `node scripts/polar-create-product.js <slug>` reads `products/<slug>/PLAN.md`, requires `lane: digital`, uploads every `assets/*.zip`, prints the product URL `https://polar.sh/knackdesk/products/<id>` and writes `polar_url` into PLAN.md front-matter.

- [ ] **Step 1: Implement http.js (exercised by the Polar tests)**

```js
export class HttpError extends Error {
  constructor(method, url, status, body) {
    super(`${method} ${url} -> ${status}: ${body}`);
    this.status = status;
    this.body = body;
  }
}

export async function request(url, { method = "GET", headers = {}, body, raw = false, fetchImpl = fetch } = {}) {
  const init = { method, headers: { ...headers } };
  if (body !== undefined) {
    init.body = raw ? body : JSON.stringify(body);
    if (!raw) init.headers["Content-Type"] = "application/json";
  }
  const res = await fetchImpl(url, init);
  const text = await res.text();
  if (res.status >= 400) throw new HttpError(method, url, res.status, text);
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  return { status: res.status, json, headers: res.headers };
}
```

- [ ] **Step 2: Write the failing Polar tests**

`scripts/lib/polar.test.js`:
```js
import { describe, it, expect, vi } from "vitest";
import { createPolarClient } from "./polar.js";

function mockFetch(routes) {
  const calls = [];
  const fetchImpl = vi.fn(async (url, init = {}) => {
    const method = init.method || "GET";
    const body = init.body === undefined ? undefined : typeof init.body === "string" ? JSON.parse(init.body) : init.body;
    calls.push({ url: String(url), method, body });
    const key = `${method} ${new URL(url).pathname}`;
    const r = routes[key];
    if (!r) return { status: 404, text: async () => `no route ${key}`, headers: new Map() };
    return { status: r.status || 200, text: async () => JSON.stringify(r.body ?? {}), headers: new Map(r.headers || []) };
  });
  return { fetchImpl, calls };
}

const base = { token: "t", orgId: "org-1" };

describe("findProductBySlug", () => {
  it("returns the product whose metadata.slug matches", async () => {
    const { fetchImpl } = mockFetch({ "GET /v1/products/": { body: { items: [{ id: "p1", metadata: { slug: "a" } }, { id: "p2", metadata: { slug: "b" } }], pagination: { max_page: 1 } } } });
    const c = createPolarClient({ ...base, fetchImpl });
    expect((await c.findProductBySlug("b")).id).toBe("p2");
    expect(await c.findProductBySlug("zzz")).toBeNull();
  });
});

describe("upsertProduct", () => {
  it("creates with fixed one-time price in cents and slug metadata", async () => {
    const { fetchImpl, calls } = mockFetch({
      "GET /v1/products/": { body: { items: [], pagination: { max_page: 1 } } },
      "POST /v1/products/": { status: 201, body: { id: "new" } },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    const p = await c.upsertProduct({ slug: "kit", name: "Kit", description: "d", priceCents: 900 });
    expect(p.id).toBe("new");
    const post = calls.find((x) => x.method === "POST");
    expect(post.body).toMatchObject({ name: "Kit", recurring_interval: null, organization_id: "org-1", metadata: { slug: "kit" }, prices: [{ amount_type: "fixed", price_amount: 900, price_currency: "usd" }] });
  });
  it("patches an existing product instead of creating", async () => {
    const { fetchImpl, calls } = mockFetch({
      "GET /v1/products/": { body: { items: [{ id: "p1", metadata: { slug: "kit" } }], pagination: { max_page: 1 } } },
      "PATCH /v1/products/p1": { body: { id: "p1" } },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    await c.upsertProduct({ slug: "kit", name: "Kit2", description: "d2", priceCents: 900 });
    expect(calls.some((x) => x.method === "POST")).toBe(false);
    expect(calls.find((x) => x.method === "PATCH").body).toEqual({ name: "Kit2", description: "d2" });
  });
  it("surfaces API errors with status and body", async () => {
    const { fetchImpl } = mockFetch({
      "GET /v1/products/": { body: { items: [], pagination: { max_page: 1 } } },
      "POST /v1/products/": { status: 422, body: { detail: "name too short" } },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    await expect(c.upsertProduct({ slug: "k", name: "K", description: "d", priceCents: 1 })).rejects.toThrow(/422.*name too short/);
  });
});

describe("uploadFile + benefit", () => {
  it("creates file, PUTs bytes to the presigned url, completes with etag, creates benefit, attaches", async () => {
    const { fetchImpl, calls } = mockFetch({
      "POST /v1/files/": { status: 201, body: { id: "f1", path: "org/f1.zip", upload: { parts: [{ number: 1, url: "https://s3.test/part1", headers: { "x-h": "1" } }] } } },
      "PUT /part1": { body: {}, headers: [["etag", '"abc"']] },
      "POST /v1/files/f1/uploaded": { body: { id: "f1", is_uploaded: true } },
      "POST /v1/benefits/": { status: 201, body: { id: "b1" } },
      "POST /v1/products/p1/benefits": { body: {} },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    const fileId = await c.uploadFile({ name: "kit.zip", buffer: Buffer.from("zipdata"), mimeType: "application/zip" });
    expect(fileId).toBe("f1");
    const create = calls.find((x) => x.url.endsWith("/v1/files/"));
    expect(create.body).toMatchObject({ name: "kit.zip", mime_type: "application/zip", size: 7, service: "downloadable", organization_id: "org-1", upload: { parts: [{ number: 1, chunk_start: 0, chunk_end: 7 }] } });
    const done = calls.find((x) => x.url.endsWith("/uploaded"));
    expect(done.body).toEqual({ id: "f1", path: "org/f1.zip", parts: [{ number: 1, checksum_etag: "abc", checksum_sha256_base64: null }] });
    const benefitId = await c.createDownloadableBenefit({ description: "Download the kit", fileIds: ["f1"] });
    expect(benefitId).toBe("b1");
    await c.attachBenefits("p1", ["b1"]);
    expect(calls.at(-1).body).toEqual({ benefits: ["b1"] });
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run scripts/lib/polar.test.js`
Expected: FAIL, cannot find module `./polar.js`.

- [ ] **Step 4: Implement polar.js**

```js
import { request } from "./http.js";

const API = "https://api.polar.sh";

export function createPolarClient({ token, orgId, fetchImpl = fetch }) {
  const headers = { Authorization: `Bearer ${token}` };
  const call = (path, opts = {}) => request(`${API}${path}`, { ...opts, headers: { ...headers, ...(opts.headers || {}) }, fetchImpl });

  async function listAll(path) {
    const items = [];
    for (let page = 1, max = 1; page <= max; page++) {
      const { json } = await call(`${path}?organization_id=${orgId}&limit=100&page=${page}`);
      items.push(...json.items);
      max = json.pagination?.max_page ?? 1;
    }
    return items;
  }

  const listAllProducts = () => listAll("/v1/products/");
  const listOrders = () => listAll("/v1/orders/");

  async function findProductBySlug(slug) {
    const all = await listAllProducts();
    return all.find((p) => p.metadata?.slug === slug) ?? null;
  }

  async function upsertProduct({ slug, name, description, priceCents }) {
    const existing = await findProductBySlug(slug);
    if (existing) {
      const { json } = await call(`/v1/products/${existing.id}`, { method: "PATCH", body: { name, description } });
      return json;
    }
    const body = {
      name,
      description,
      organization_id: orgId,
      recurring_interval: null,
      metadata: { slug },
      prices: [{ amount_type: "fixed", price_amount: priceCents, price_currency: "usd" }],
    };
    const { json } = await call("/v1/products/", { method: "POST", body });
    return json;
  }

  async function uploadFile({ name, buffer, mimeType }) {
    const size = buffer.length;
    const created = await call("/v1/files/", {
      method: "POST",
      body: { name, mime_type: mimeType, size, service: "downloadable", organization_id: orgId, upload: { parts: [{ number: 1, chunk_start: 0, chunk_end: size }] } },
    });
    const part = created.json.upload.parts[0];
    const put = await request(part.url, { method: "PUT", headers: part.headers || {}, body: buffer, raw: true, fetchImpl });
    const etag = String(put.headers.get("etag") || "").replace(/"/g, "");
    await call(`/v1/files/${created.json.id}/uploaded`, {
      method: "POST",
      body: { id: created.json.id, path: created.json.path, parts: [{ number: 1, checksum_etag: etag, checksum_sha256_base64: null }] },
    });
    return created.json.id;
  }

  async function createDownloadableBenefit({ description, fileIds }) {
    const { json } = await call("/v1/benefits/", { method: "POST", body: { type: "downloadables", description, organization_id: orgId, properties: { files: fileIds } } });
    return json.id;
  }

  async function attachBenefits(productId, benefitIds) {
    await call(`/v1/products/${productId}/benefits`, { method: "POST", body: { benefits: benefitIds } });
  }

  return { listAllProducts, listOrders, findProductBySlug, upsertProduct, uploadFile, createDownloadableBenefit, attachBenefits };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run scripts/lib/polar.test.js`
Expected: 5 passed.

- [ ] **Step 6: Implement the CLI polar-create-product.js**

```js
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadDotEnv, requireEnv } from "./lib/env.js";
import { parseFrontmatter, validateProduct } from "./lib/frontmatter.js";
import { createPolarClient } from "./lib/polar.js";

const slug = process.argv[2];
if (!slug) { console.error("usage: node scripts/polar-create-product.js <slug>"); process.exit(2); }

await loadDotEnv();
const env = requireEnv(["POLAR_ACCESS_TOKEN", "POLAR_ORG_ID"]);
const dir = join(process.cwd(), "products", slug);
const planPath = join(dir, "PLAN.md");
if (!existsSync(planPath)) { console.error(`no PLAN.md in ${dir}`); process.exit(2); }

const raw = readFileSync(planPath, "utf8");
const { data } = parseFrontmatter(raw);
validateProduct(data);
if (data.lane !== "digital") { console.error(`lane must be digital, got ${data.lane}`); process.exit(2); }

const client = createPolarClient({ token: env.POLAR_ACCESS_TOKEN, orgId: env.POLAR_ORG_ID });
const product = await client.upsertProduct({ slug, name: data.name, description: data.description, priceCents: data.price_cents });
console.log(`product ${product.id}`);

const assetsDir = join(dir, "assets");
const zips = existsSync(assetsDir) ? readdirSync(assetsDir).filter((f) => f.endsWith(".zip")) : [];
if (zips.length === 0) { console.error("no assets/*.zip to attach"); process.exit(2); }
const fileIds = [];
for (const zip of zips) {
  const id = await client.uploadFile({ name: zip, buffer: readFileSync(join(assetsDir, zip)), mimeType: "application/zip" });
  console.log(`uploaded ${zip} -> ${id}`);
  fileIds.push(id);
}
const benefitId = await client.createDownloadableBenefit({ description: `Download ${data.name}`.slice(0, 42), fileIds });
await client.attachBenefits(product.id, [benefitId]);

const url = `https://polar.sh/knackdesk/products/${product.id}`;
const updated = raw.includes("polar_url:")
  ? raw.replace(/polar_url:.*/, `polar_url: ${url}`)
  : raw.replace(/^---\r?\n/, `---\npolar_url: ${url}\n`);
writeFileSync(planPath, updated);
console.log(`listed at ${url}`);
```

- [ ] **Step 7: Dry-run the CLI without tokens to confirm the guard**

Run: `node scripts/polar-create-product.js demo; echo "exit=$?"`
Expected: `Missing env: POLAR_ACCESS_TOKEN, POLAR_ORG_ID` error and `exit=1`.

- [ ] **Step 8: Commit**

```bash
git add scripts/lib/http.js scripts/lib/polar.js scripts/lib/polar.test.js scripts/polar-create-product.js
git commit -m "feat: Polar client with idempotent product, file and benefit creation"
```

---

### Task 8: Sales ledger refresh

**Files:**
- Create: `scripts/lib/ledger.js`, `scripts/polar-sales.js`
- Test: `scripts/lib/ledger.test.js`

**Interfaces:**
- Consumes: `createPolarClient(...).listOrders()` and `listAllProducts()` from Task 7; `pipeline/LEDGER.md` header from Task 3.
- Produces: `parseLedger(md): { head: string, rows: Row[] }` where `Row = { slug, lane, launched, url, price_usd, units, gross_usd, net_usd }` (all strings).
- Produces: `summarizeOrders(orders, productIdToSlug): Record<slug, { units, gross_cents, net_cents }>`.
- Produces: `applySales(rows, summary): Row[]` — new array; rows absent from summary get units `"0"` and `"0.00"` amounts; rows never removed.
- Produces: `renderLedger(head, rows): string`.

- [ ] **Step 1: Write the failing tests**

`scripts/lib/ledger.test.js`:
```js
import { describe, it, expect } from "vitest";
import { parseLedger, summarizeOrders, applySales, renderLedger } from "./ledger.js";

const md = `# Ledger

Refreshed by \`npm run polar:sales\`. Amounts in USD.

| slug | lane | launched | url | price_usd | units | gross_usd | net_usd |
|---|---|---|---|---|---|---|---|
| kit | digital | 2026-10-01 | https://polar.sh/x | 9.00 | 3 | 27.00 | 24.15 |
| conv | tool | 2026-10-02 | https://knackdesk.com/conv/ | 0 | 0 | 0.00 | 0.00 |
`;

describe("ledger", () => {
  it("round-trips parse and render", () => {
    const { head, rows } = parseLedger(md);
    expect(rows).toHaveLength(2);
    expect(rows[0].slug).toBe("kit");
    expect(renderLedger(head, rows)).toBe(md);
  });
  it("summarizes orders per slug in cents", () => {
    const orders = [
      { product_id: "p1", total_amount: 900, net_amount: 805 },
      { product_id: "p1", total_amount: 900, net_amount: 805 },
      { product_id: "p9", total_amount: 100, net_amount: 50 },
    ];
    expect(summarizeOrders(orders, { p1: "kit" })).toEqual({ kit: { units: 2, gross_cents: 1800, net_cents: 1610 } });
  });
  it("applies sales without dropping rows and zeroes unsold ones", () => {
    const { rows } = parseLedger(md);
    const out = applySales(rows, { kit: { units: 5, gross_cents: 4500, net_cents: 4025 } });
    expect(out).not.toBe(rows);
    expect(out[0]).toMatchObject({ units: "5", gross_usd: "45.00", net_usd: "40.25" });
    expect(out[1]).toMatchObject({ units: "0", gross_usd: "0.00", net_usd: "0.00" });
    expect(out).toHaveLength(2);
  });
  it("applying an empty summary keeps every row", () => {
    const { rows } = parseLedger(md);
    expect(applySales(rows, {})).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run scripts/lib/ledger.test.js`
Expected: FAIL, cannot find module.

- [ ] **Step 3: Implement ledger.js**

```js
const COLS = ["slug", "lane", "launched", "url", "price_usd", "units", "gross_usd", "net_usd"];

export function parseLedger(md) {
  const lines = md.split("\n");
  const headerIdx = lines.findIndex((l) => l.startsWith("| slug |"));
  if (headerIdx === -1) throw new Error("LEDGER.md: header row not found");
  const head = lines.slice(0, headerIdx).join("\n");
  const rows = lines
    .slice(headerIdx + 2)
    .filter((l) => l.startsWith("|"))
    .map((l) => {
      const cells = l.split("|").slice(1, -1).map((c) => c.trim());
      return Object.fromEntries(COLS.map((c, i) => [c, cells[i] ?? ""]));
    });
  return { head, rows };
}

export function renderLedger(head, rows) {
  const header = `| ${COLS.join(" | ")} |\n|${COLS.map(() => "---").join("|")}|`;
  const body = rows.map((r) => `| ${COLS.map((c) => r[c]).join(" | ")} |`).join("\n");
  return `${head}\n${header}\n${body}\n`;
}

export function summarizeOrders(orders, productIdToSlug) {
  const out = {};
  for (const o of orders) {
    const slug = productIdToSlug[o.product_id];
    if (!slug) continue;
    const cur = out[slug] ?? { units: 0, gross_cents: 0, net_cents: 0 };
    out[slug] = { units: cur.units + 1, gross_cents: cur.gross_cents + (o.total_amount ?? 0), net_cents: cur.net_cents + (o.net_amount ?? 0) };
  }
  return out;
}

const usd = (cents) => (cents / 100).toFixed(2);

export function applySales(rows, summary) {
  return rows.map((r) => {
    const s = summary[r.slug] ?? { units: 0, gross_cents: 0, net_cents: 0 };
    return { ...r, units: String(s.units), gross_usd: usd(s.gross_cents), net_usd: usd(s.net_cents) };
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run scripts/lib/ledger.test.js`
Expected: 4 passed.

- [ ] **Step 5: Implement polar-sales.js CLI**

```js
import { readFileSync, writeFileSync } from "node:fs";
import { loadDotEnv, requireEnv } from "./lib/env.js";
import { createPolarClient } from "./lib/polar.js";
import { parseLedger, summarizeOrders, applySales, renderLedger } from "./lib/ledger.js";

await loadDotEnv();
const env = requireEnv(["POLAR_ACCESS_TOKEN", "POLAR_ORG_ID"]);
const client = createPolarClient({ token: env.POLAR_ACCESS_TOKEN, orgId: env.POLAR_ORG_ID });

const products = await client.listAllProducts();
const idToSlug = Object.fromEntries(products.filter((p) => p.metadata?.slug).map((p) => [p.id, p.metadata.slug]));
const orders = await client.listOrders();
const summary = summarizeOrders(orders, idToSlug);

const path = "pipeline/LEDGER.md";
const { head, rows } = parseLedger(readFileSync(path, "utf8"));
const updated = applySales(rows, summary);
writeFileSync(path, renderLedger(head, updated));
for (const r of updated) console.log(`${r.slug.padEnd(20)} units=${r.units} gross=${r.gross_usd} net=${r.net_usd}`);
```

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/ledger.js scripts/lib/ledger.test.js scripts/polar-sales.js
git commit -m "feat: refresh sales ledger from Polar orders"
```

---

### Task 9: Cloudflare DNS for GitHub Pages

**Files:**
- Create: `scripts/lib/cloudflare.js`, `scripts/cloudflare-dns.js`
- Test: `scripts/lib/cloudflare.test.js`

**Interfaces:**
- Consumes: `request` from Task 7's `http.js`.
- Produces: `desiredRecords(domain, ghOrg): Array<{ type, name, content, proxied: false, ttl: 1 }>` — 4 A + 4 AAAA for apex, 1 CNAME `www` → `<ghOrg>.github.io`.
- Produces: `planChanges(existing, desired, domain): { create: Rec[], keep: Rec[] }` — a desired record is kept if an existing record has the same type, fully-qualified name and content.
- Produces: `ensureRecords({ token, zoneId, domain, ghOrg, fetchImpl })` → `{ created: number, kept: number }`.

- [ ] **Step 1: Write the failing tests**

`scripts/lib/cloudflare.test.js`:
```js
import { describe, it, expect, vi } from "vitest";
import { desiredRecords, planChanges, ensureRecords } from "./cloudflare.js";

describe("desiredRecords", () => {
  it("has 4 A, 4 AAAA and one www CNAME", () => {
    const recs = desiredRecords("knackdesk.com", "knackdesk");
    expect(recs.filter((r) => r.type === "A")).toHaveLength(4);
    expect(recs.filter((r) => r.type === "AAAA")).toHaveLength(4);
    expect(recs.find((r) => r.type === "CNAME")).toMatchObject({ name: "www", content: "knackdesk.github.io", proxied: false });
    expect(recs.find((r) => r.type === "A").content).toBe("185.199.108.153");
  });
});

describe("planChanges", () => {
  it("does not recreate records that already exist", () => {
    const desired = desiredRecords("knackdesk.com", "knackdesk");
    const existing = [{ type: "A", name: "knackdesk.com", content: "185.199.108.153" }];
    const { create, keep } = planChanges(existing, desired, "knackdesk.com");
    expect(keep).toHaveLength(1);
    expect(create).toHaveLength(8);
  });
});

describe("ensureRecords", () => {
  it("lists then creates only missing records", async () => {
    const posts = [];
    const fetchImpl = vi.fn(async (url, init = {}) => {
      if ((init.method || "GET") === "GET") return { status: 200, text: async () => JSON.stringify({ result: [{ type: "A", name: "knackdesk.com", content: "185.199.108.153" }] }), headers: new Map() };
      posts.push(JSON.parse(init.body));
      return { status: 200, text: async () => JSON.stringify({ result: { id: "r" } }), headers: new Map() };
    });
    const out = await ensureRecords({ token: "t", zoneId: "z", domain: "knackdesk.com", ghOrg: "knackdesk", fetchImpl });
    expect(out).toEqual({ created: 8, kept: 1 });
    expect(posts).toHaveLength(8);
    expect(String(fetchImpl.mock.calls[0][0])).toContain("/zones/z/dns_records");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run scripts/lib/cloudflare.test.js`
Expected: FAIL, cannot find module.

- [ ] **Step 3: Implement cloudflare.js**

```js
import { request } from "./http.js";

const API = "https://api.cloudflare.com/client/v4";
const GH_A = ["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"];
const GH_AAAA = ["2606:50c0:8000::153", "2606:50c0:8001::153", "2606:50c0:8002::153", "2606:50c0:8003::153"];

export function desiredRecords(domain, ghOrg) {
  const base = { proxied: false, ttl: 1 };
  return [
    ...GH_A.map((content) => ({ type: "A", name: domain, content, ...base })),
    ...GH_AAAA.map((content) => ({ type: "AAAA", name: domain, content, ...base })),
    { type: "CNAME", name: "www", content: `${ghOrg}.github.io`, ...base },
  ];
}

const fqdn = (name, domain) => (name === "www" ? `www.${domain}` : name);
const key = (r, domain) => `${r.type}|${fqdn(r.name, domain)}|${r.content}`;

export function planChanges(existing, desired, domain) {
  const have = new Set(existing.map((r) => key(r, domain)));
  const keep = desired.filter((r) => have.has(key(r, domain)));
  const create = desired.filter((r) => !have.has(key(r, domain)));
  return { create, keep };
}

export async function ensureRecords({ token, zoneId, domain, ghOrg, fetchImpl = fetch }) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = `${API}/zones/${zoneId}/dns_records`;
  const { json } = await request(`${url}?per_page=100`, { headers, fetchImpl });
  const { create, keep } = planChanges(json.result ?? [], desiredRecords(domain, ghOrg), domain);
  for (const rec of create) await request(url, { method: "POST", headers, body: rec, fetchImpl });
  return { created: create.length, kept: keep.length };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run scripts/lib/cloudflare.test.js`
Expected: 3 passed.

- [ ] **Step 5: Implement cloudflare-dns.js CLI**

```js
import { loadDotEnv, requireEnv } from "./lib/env.js";
import { ensureRecords } from "./lib/cloudflare.js";

await loadDotEnv();
const env = requireEnv(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID"]);
const out = await ensureRecords({ token: env.CLOUDFLARE_API_TOKEN, zoneId: env.CLOUDFLARE_ZONE_ID, domain: "knackdesk.com", ghOrg: "knackdesk" });
console.log(`dns: created ${out.created}, kept ${out.kept}`);
console.log("next: in GitHub repo settings > Pages, set custom domain knackdesk.com and enforce HTTPS");
```

- [ ] **Step 6: Run the full suite**

Run: `npx vitest run`
Expected: all tests pass, 0 failures.

- [ ] **Step 7: Commit**

```bash
git add scripts/lib/cloudflare.js scripts/lib/cloudflare.test.js scripts/cloudflare-dns.js
git commit -m "feat: idempotent Cloudflare DNS setup for GitHub Pages"
```

---

### Task 10: Owner setup guide and GitHub publish

**Files:**
- Create: `docs/SETUP.md`

**Interfaces:**
- Consumes: everything above.
- Produces: repo pushed to `github.com/knackdesk/knackdesk` with Pages enabled. Steps 3 and 4 are blocked until the owner supplies tokens; the loop proceeds with product work meanwhile.

- [ ] **Step 1: Write docs/SETUP.md**

```markdown
# Owner Setup (one time, about 30 minutes)

Paste each value into `.env` (copy `.env.example` first). Run `npm run check-env` to confirm.

## 1. GitHub (needed to publish anything)
1. github.com > your avatar > Your organizations > New organization > Free > name `knackdesk`.
2. Settings > Developer settings > Personal access tokens > Fine-grained > Generate.
   Resource owner: knackdesk. Repository access: All repositories.
   Permissions: Administration (read/write), Contents (read/write), Pages (read/write), Workflows (read/write), Variables (read/write).
3. Paste as `GITHUB_TOKEN`.

## 2. Polar (needed to sell)
1. polar.sh > Sign up with the knackdesk GitHub account > Create organization `knackdesk`.
2. Finance > Payout account > connect Stripe (identity + bank).
3. Settings > Developers > New token. Scopes: products:read, products:write, files:read, files:write, benefits:read, benefits:write, orders:read.
4. Paste as `POLAR_ACCESS_TOKEN`. Organization id is in Settings > General; paste as `POLAR_ORG_ID`.

## 3. Cloudflare (needed for knackdesk.com)
1. cloudflare.com > Domain Registration > Register > knackdesk.com (about 10 USD/yr).
2. Overview page of the zone: copy Zone ID > `CLOUDFLARE_ZONE_ID`.
3. My Profile > API Tokens > Create Token > Edit zone DNS template > Zone: knackdesk.com > paste as `CLOUDFLARE_API_TOKEN`.

## 4. AdSense (later, when told the site is ready)
Sign up at adsense.google.com with knackdesk.com, paste the `ca-pub-...` id into the GitHub repo variable `ADSENSE_CLIENT_ID` (Settings > Secrets and variables > Actions > Variables).

## 5. Chrome Web Store (later, when the first extension is ready)
Pay the 5 USD registration at chrome.google.com/webstore/devconsole.
```

- [ ] **Step 2: Commit**

```bash
git add docs/SETUP.md && git commit -m "docs: owner setup guide"
```

- [ ] **Step 3: Publish to GitHub (run only once GITHUB_TOKEN is in .env)**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && set -a && source .env && set +a
echo "$GITHUB_TOKEN" | gh auth login --with-token
gh repo create knackdesk/knackdesk --public --source=. --remote=origin --push
gh api -X POST repos/knackdesk/knackdesk/pages -f build_type=workflow
gh workflow run deploy.yml
```

Expected: repo visible at github.com/knackdesk/knackdesk; deploy workflow green; site at knackdesk.github.io.

- [ ] **Step 4: After the domain exists, set DNS and custom domain**

```bash
npm run dns
gh api -X PUT repos/knackdesk/knackdesk/pages -f cname=knackdesk.com -F https_enforced=true
```

Expected: `dns: created 9, kept 0` on first run, `created 0, kept 9` on rerun; site answers at https://knackdesk.com within an hour.
