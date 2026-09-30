import { describe, it, expect, vi } from "vitest";
import { createPolarClient } from "./polar.js";

function mockFetch(routes) {
  const calls = [];
  const fetchImpl = vi.fn(async (url, init = {}) => {
    const method = init.method || "GET";
    const body = init.body === undefined ? undefined : typeof init.body === "string" ? JSON.parse(init.body) : init.body;
    calls.push({ url: String(url), method, body });
    const key = `${method} ${new URL(url).pathname}`;
    const r = routes[key];
    if (!r) return { status: 404, text: async () => `no route ${key}`, headers: new Map() };
    return { status: r.status || 200, text: async () => JSON.stringify(r.body ?? {}), headers: new Map(r.headers || []) };
  });
  return { fetchImpl, calls };
}

const base = { token: "t", orgId: "org-1" };

describe("findProductBySlug", () => {
  it("returns the product whose metadata.slug matches", async () => {
    const { fetchImpl } = mockFetch({ "GET /v1/products/": { body: { items: [{ id: "p1", metadata: { slug: "a" } }, { id: "p2", metadata: { slug: "b" } }], pagination: { max_page: 1 } } } });
    const c = createPolarClient({ ...base, fetchImpl });
    expect((await c.findProductBySlug("b")).id).toBe("p2");
    expect(await c.findProductBySlug("zzz")).toBeNull();
  });
});

describe("upsertProduct", () => {
  it("creates with fixed one-time price in cents and slug metadata", async () => {
    const { fetchImpl, calls } = mockFetch({
      "GET /v1/products/": { body: { items: [], pagination: { max_page: 1 } } },
      "POST /v1/products/": { status: 201, body: { id: "new" } },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    const p = await c.upsertProduct({ slug: "kit", name: "Kit", description: "d", priceCents: 900 });
    expect(p.id).toBe("new");
    const post = calls.find((x) => x.method === "POST");
    expect(post.body).toMatchObject({ name: "Kit", recurring_interval: null, organization_id: "org-1", metadata: { slug: "kit" }, prices: [{ amount_type: "fixed", price_amount: 900, price_currency: "usd" }] });
  });
  it("patches an existing product instead of creating", async () => {
    const { fetchImpl, calls } = mockFetch({
      "GET /v1/products/": { body: { items: [{ id: "p1", metadata: { slug: "kit" } }], pagination: { max_page: 1 } } },
      "PATCH /v1/products/p1": { body: { id: "p1" } },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    await c.upsertProduct({ slug: "kit", name: "Kit2", description: "d2", priceCents: 900 });
    expect(calls.some((x) => x.method === "POST")).toBe(false);
    expect(calls.find((x) => x.method === "PATCH").body).toEqual({ name: "Kit2", description: "d2" });
  });
  it("surfaces API errors with status and body", async () => {
    const { fetchImpl } = mockFetch({
      "GET /v1/products/": { body: { items: [], pagination: { max_page: 1 } } },
      "POST /v1/products/": { status: 422, body: { detail: "name too short" } },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    await expect(c.upsertProduct({ slug: "k", name: "K", description: "d", priceCents: 1 })).rejects.toThrow(/422.*name too short/);
  });
});

describe("upsertDownloadableBenefit", () => {
  it("creates a benefit tagged with the slug when none exists", async () => {
    const { fetchImpl, calls } = mockFetch({
      "GET /v1/benefits/": { body: { items: [], pagination: { max_page: 1 } } },
      "POST /v1/benefits/": { status: 201, body: { id: "b1" } },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    expect(await c.upsertDownloadableBenefit({ slug: "kit", description: "Download Kit", fileIds: ["f1"] })).toBe("b1");
    expect(calls.find((x) => x.method === "POST").body).toMatchObject({ type: "downloadables", metadata: { slug: "kit" }, properties: { files: ["f1"] } });
  });
  it("patches the existing benefit for the slug instead of creating another", async () => {
    const { fetchImpl, calls } = mockFetch({
      "GET /v1/benefits/": { body: { items: [{ id: "b9", type: "downloadables", metadata: { slug: "kit" } }], pagination: { max_page: 1 } } },
      "PATCH /v1/benefits/b9": { body: { id: "b9" } },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    expect(await c.upsertDownloadableBenefit({ slug: "kit", description: "Download Kit", fileIds: ["f2"] })).toBe("b9");
    expect(calls.some((x) => x.method === "POST")).toBe(false);
    expect(calls.find((x) => x.method === "PATCH").body).toEqual({ description: "Download Kit", properties: { files: ["f2"] } });
  });
});

describe("uploadFile + benefit", () => {
  it("creates file, PUTs bytes to the presigned url, completes with etag, creates benefit, attaches", async () => {
    const { fetchImpl, calls } = mockFetch({
      "POST /v1/files/": { status: 201, body: { id: "f1", path: "org/f1.zip", upload: { id: "mp-1", path: "org/f1.zip", parts: [{ number: 1, url: "https://s3.test/part1", headers: { "x-h": "1" } }] } } },
      "PUT /part1": { body: {}, headers: [["etag", '"abc"']] },
      "POST /v1/files/f1/uploaded": { body: { id: "f1", is_uploaded: true } },
      "POST /v1/benefits/": { status: 201, body: { id: "b1" } },
      "POST /v1/products/p1/benefits": { body: {} },
    });
    const c = createPolarClient({ ...base, fetchImpl });
    const fileId = await c.uploadFile({ name: "kit.zip", buffer: Buffer.from("zipdata"), mimeType: "application/zip" });
    expect(fileId).toBe("f1");
    const create = calls.find((x) => x.url.endsWith("/v1/files/"));
    expect(create.body).toMatchObject({ name: "kit.zip", mime_type: "application/zip", size: 7, service: "downloadable", organization_id: "org-1", upload: { parts: [{ number: 1, chunk_start: 0, chunk_end: 7 }] } });
    const done = calls.find((x) => x.url.endsWith("/uploaded"));
    expect(done.body).toEqual({ id: "mp-1", path: "org/f1.zip", parts: [{ number: 1, checksum_etag: "abc", checksum_sha256_base64: null }] });
    const benefitId = await c.createDownloadableBenefit({ description: "Download the kit", fileIds: ["f1"] });
    expect(benefitId).toBe("b1");
    await c.attachBenefits("p1", ["b1"]);
    expect(calls.at(-1).body).toEqual({ benefits: ["b1"] });
  });
});
