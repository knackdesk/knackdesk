import { createHash } from "node:crypto";
import { request } from "./http.js";

const API = "https://api.polar.sh";

export function createPolarClient({ token, orgId, fetchImpl = fetch }) {
  const headers = { Authorization: `Bearer ${token}` };
  const isOrgToken = String(token).startsWith("polar_oat_");
  const withOrg = (body) => (isOrgToken ? body : { ...body, organization_id: orgId });
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
    const body = withOrg({
      name,
      description,
      recurring_interval: null,
      metadata: { slug },
      prices: [{ amount_type: "fixed", price_amount: priceCents, price_currency: "usd" }],
    });
    const { json } = await call("/v1/products/", { method: "POST", body });
    return json;
  }

  async function uploadFile({ name, buffer, mimeType }) {
    const size = buffer.length;
    const sha = createHash("sha256").update(buffer).digest("base64");
    const created = await call("/v1/files/", {
      method: "POST",
      body: withOrg({ name, mime_type: mimeType, size, service: "downloadable", checksum_sha256_base64: sha, upload: { parts: [{ number: 1, chunk_start: 0, chunk_end: size, checksum_sha256_base64: sha }] } }),
    });
    const part = created.json.upload.parts[0];
    const headers = { ...(part.headers || {}) };
    if (!Object.keys(headers).some((h) => h.toLowerCase() === "x-amz-checksum-sha256")) headers["x-amz-checksum-sha256"] = sha;
    const put = await request(part.url, { method: "PUT", headers, body: buffer, raw: true, fetchImpl });
    const etag = String(put.headers.get("etag") || "").replace(/"/g, "");
    await call(`/v1/files/${created.json.id}/uploaded`, {
      method: "POST",
      body: { id: created.json.upload.id, path: created.json.upload.path, parts: [{ number: 1, checksum_etag: etag, checksum_sha256_base64: sha }] },
    });
    return created.json.id;
  }

  async function createDownloadableBenefit({ description, fileIds, slug }) {
    const body = withOrg({ type: "downloadables", description, properties: { files: fileIds } });
    if (slug) body.metadata = { slug };
    const { json } = await call("/v1/benefits/", { method: "POST", body });
    return json.id;
  }

  async function upsertDownloadableBenefit({ slug, description, fileIds }) {
    const all = await listAll("/v1/benefits/");
    const existing = all.find((b) => b.type === "downloadables" && b.metadata?.slug === slug);
    if (!existing) return createDownloadableBenefit({ description, fileIds, slug });
    await call(`/v1/benefits/${existing.id}`, { method: "PATCH", body: { description, properties: { files: fileIds } } });
    return existing.id;
  }

  async function ensureCheckoutLink({ slug, productId, label }) {
    const links = await listAll("/v1/checkout-links/");
    const existing = links.find((l) => l.metadata?.slug === slug);
    if (existing) return existing.url;
    const { json } = await call("/v1/checkout-links/", {
      method: "POST",
      body: { payment_processor: "stripe", products: [productId], label, metadata: { slug }, success_url: "https://knackdesk.com/thanks/", allow_discount_codes: true },
    });
    return json.url;
  }

  async function attachBenefits(productId, benefitIds) {
    await call(`/v1/products/${productId}/benefits`, { method: "POST", body: { benefits: benefitIds } });
  }

  return { listAllProducts, listOrders, findProductBySlug, upsertProduct, uploadFile, createDownloadableBenefit, upsertDownloadableBenefit, attachBenefits, ensureCheckoutLink };
}
