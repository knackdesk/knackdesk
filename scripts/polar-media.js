/** Upload a kit's cover and sheet screenshots to Polar as product media and set the gallery. Usage: node scripts/polar-media.js <slug> */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadDotEnv } from "./lib/env.js";
import { createPolarClient } from "./lib/polar.js";

const slug = process.argv[2];
if (!slug) { console.error("usage: polar-media.js <slug>"); process.exit(1); }
await loadDotEnv();
const client = createPolarClient({ token: process.env.POLAR_ACCESS_TOKEN, orgId: process.env.POLAR_ORG_ID });
const dir = join(process.cwd(), "products", slug, "assets", "images");
if (!existsSync(dir)) { console.error(`no images at ${dir}; run scripts/kit-images.py ${slug}`); process.exit(1); }
const files = readdirSync(dir).filter((f) => f.endsWith(".png")).sort((a, b) => (a === "cover.png" ? -1 : b === "cover.png" ? 1 : a.localeCompare(b)));
const product = await client.findProductBySlug(slug);
if (!product) { console.error(`no Polar product with metadata.slug=${slug}`); process.exit(1); }
const ids = [];
for (const f of files) {
  const id = await client.uploadFile({ name: `${slug}-${f}`, buffer: readFileSync(join(dir, f)), mimeType: "image/png", service: "product_media" });
  ids.push(id); console.log(`uploaded ${f} -> ${id}`);
}
const updated = await client.setProductMedias(product.id, ids);
console.log(`set ${updated.medias?.length ?? ids.length} medias on ${product.id}`);
