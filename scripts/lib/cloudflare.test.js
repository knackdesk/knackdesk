import { describe, it, expect, vi } from "vitest";
import { desiredRecords, planChanges, ensureRecords } from "./cloudflare.js";

describe("desiredRecords", () => {
  it("has 4 A, 4 AAAA and one www CNAME", () => {
    const recs = desiredRecords("knackdesk.com", "knackdesk");
    expect(recs.filter((r) => r.type === "A")).toHaveLength(4);
    expect(recs.filter((r) => r.type === "AAAA")).toHaveLength(4);
    expect(recs.find((r) => r.type === "CNAME")).toMatchObject({ name: "www", content: "knackdesk.github.io", proxied: false });
    expect(recs.find((r) => r.type === "A").content).toBe("185.199.108.153");
  });
});

describe("planChanges", () => {
  it("does not recreate records that already exist", () => {
    const desired = desiredRecords("knackdesk.com", "knackdesk");
    const existing = [{ type: "A", name: "knackdesk.com", content: "185.199.108.153" }];
    const { create, keep } = planChanges(existing, desired, "knackdesk.com");
    expect(keep).toHaveLength(1);
    expect(create).toHaveLength(8);
  });
});

describe("ensureRecords", () => {
  it("lists then creates only missing records", async () => {
    const posts = [];
    const fetchImpl = vi.fn(async (url, init = {}) => {
      if ((init.method || "GET") === "GET") return { status: 200, text: async () => JSON.stringify({ result: [{ type: "A", name: "knackdesk.com", content: "185.199.108.153" }] }), headers: new Map() };
      posts.push(JSON.parse(init.body));
      return { status: 200, text: async () => JSON.stringify({ result: { id: "r" } }), headers: new Map() };
    });
    const out = await ensureRecords({ token: "t", zoneId: "z", domain: "knackdesk.com", ghOrg: "knackdesk", fetchImpl });
    expect(out).toEqual({ created: 8, kept: 1 });
    expect(posts).toHaveLength(8);
    expect(String(fetchImpl.mock.calls[0][0])).toContain("/zones/z/dns_records");
  });
});
