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
for (const r of updated) console.log(`${r.slug.padEnd(20)} units=${r.units} gross=${r.gross_eur} net=${r.net_eur}`);
