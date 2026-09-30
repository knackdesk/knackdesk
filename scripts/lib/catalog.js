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
