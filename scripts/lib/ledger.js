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
