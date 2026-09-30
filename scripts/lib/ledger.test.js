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
  it("summarizes paid orders per slug: gross net of refunds, net after platform fee and refunds", () => {
    const orders = [
      { product_id: "p1", status: "paid", total_amount: 900, net_amount: 900, platform_fee_amount: 95, refunded_amount: 0 },
      { product_id: "p1", status: "partially_refunded", total_amount: 900, net_amount: 900, platform_fee_amount: 95, refunded_amount: 400 },
      { product_id: "p1", status: "refunded", total_amount: 900, net_amount: 900, platform_fee_amount: 95, refunded_amount: 900 },
      { product_id: "p1", status: "pending", total_amount: 900, net_amount: 900, platform_fee_amount: 95, refunded_amount: 0 },
      { product_id: "p9", status: "paid", total_amount: 100, net_amount: 100, platform_fee_amount: 55, refunded_amount: 0 },
    ];
    expect(summarizeOrders(orders, { p1: "kit" })).toEqual({ kit: { units: 2, gross_cents: 1400, net_cents: 1210 } });
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
