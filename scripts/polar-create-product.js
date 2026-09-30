import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadDotEnv, requireEnv } from "./lib/env.js";
import { parseFrontmatter, validateProduct } from "./lib/frontmatter.js";
import { createPolarClient } from "./lib/polar.js";

export async function runCreate({ slug, rootDir, client, log = () => {} }) {
  const dir = join(rootDir, "products", slug);
  const planPath = join(dir, "PLAN.md");
  if (!existsSync(planPath)) throw new Error(`no PLAN.md in ${dir}`);
  const raw = readFileSync(planPath, "utf8");
  const { data } = parseFrontmatter(raw);
  validateProduct(data);
  if (data.lane !== "digital") throw new Error(`lane must be digital, got ${data.lane}`);
  if (data.status !== "live") throw new Error(`product is ${data.status}; set status: live in PLAN.md before listing (draft products are never listed)`);

  const assetsDir = join(dir, "assets");
  const zips = existsSync(assetsDir) ? readdirSync(assetsDir).filter((f) => f.endsWith(".zip")) : [];
  if (zips.length === 0) throw new Error("no assets/*.zip to attach");

  const product = await client.upsertProduct({ slug, name: data.name, description: data.description, priceCents: data.price_cents });
  log(`product ${product.id}`);
  const fileIds = [];
  for (const zip of zips) {
    const id = await client.uploadFile({ name: zip, buffer: readFileSync(join(assetsDir, zip)), mimeType: "application/zip" });
    log(`uploaded ${zip} -> ${id}`);
    fileIds.push(id);
  }
  const benefitId = await client.upsertDownloadableBenefit({ slug, description: `Download ${data.name}`.slice(0, 42), fileIds });
  await client.attachBenefits(product.id, [benefitId]);

  const url = `https://polar.sh/knackdesk/products/${product.id}`;
  const updated = raw.includes("polar_url:")
    ? raw.replace(/polar_url:.*/, () => `polar_url: ${url}`)
    : raw.replace(/^---\r?\n/, () => `---\npolar_url: ${url}\n`);
  writeFileSync(planPath, updated);
  return url;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  if (!slug) { console.error("usage: node scripts/polar-create-product.js <slug>"); process.exit(2); }
  try {
    await loadDotEnv();
    const env = requireEnv(["POLAR_ACCESS_TOKEN", "POLAR_ORG_ID"]);
    const client = createPolarClient({ token: env.POLAR_ACCESS_TOKEN, orgId: env.POLAR_ORG_ID });
    const url = await runCreate({ slug, rootDir: process.cwd(), client, log: console.log });
    console.log(`listed at ${url}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
