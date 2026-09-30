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
