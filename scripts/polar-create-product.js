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
