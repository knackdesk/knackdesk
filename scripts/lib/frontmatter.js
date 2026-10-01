const LANES = ["digital", "tool", "extension"];
const STATUSES = ["draft", "live"];
export const CATEGORIES = ["invoicing", "pricing", "planning", "time"];
const HEADLINE_MAX = 60;

function isIsoDate(v) {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

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
  if (data.lane === "tool" && !CATEGORIES.includes(data.category)) fail("category", `must be one of ${CATEGORIES.join("|")} for tools`);
  if (data.reviewed !== undefined && !isIsoDate(data.reviewed)) fail("reviewed", "must be a YYYY-MM-DD date");
  if (data.headline !== undefined && (typeof data.headline !== "string" || !data.headline || data.headline.length > HEADLINE_MAX)) fail("headline", `must be 1-${HEADLINE_MAX} chars`);
  return data;
}
