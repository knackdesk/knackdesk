import { describe, it, expect, vi } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runCreate } from "./polar-create-product.js";

function fixture(status) {
  const root = mkdtempSync(join(tmpdir(), "kd-"));
  mkdirSync(join(root, "products", "kit", "assets"), { recursive: true });
  writeFileSync(join(root, "products", "kit", "assets", "kit.zip"), "zip");
  writeFileSync(join(root, "products", "kit", "PLAN.md"), `---
slug: kit
name: The Kit
lane: digital
price_cents: 900
status: ${status}
tagline: t
description: d
---`);
  return root;
}

const fakeClient = () => ({
  upsertProduct: vi.fn(async () => ({ id: "p1" })),
  uploadFile: vi.fn(async () => "f1"),
  upsertDownloadableBenefit: vi.fn(async () => "b1"),
  attachBenefits: vi.fn(async () => {}),
  ensureCheckoutLink: vi.fn(async () => "https://buy.polar.sh/abc"),
});

describe("runCreate", () => {
  it("refuses a draft product without touching Polar", async () => {
    const root = fixture("draft");
    const client = fakeClient();
    await expect(runCreate({ slug: "kit", rootDir: root, client })).rejects.toThrow(/draft/i);
    expect(client.upsertProduct).not.toHaveBeenCalled();
    rmSync(root, { recursive: true, force: true });
  });
  it("lists a live product and writes polar_url into PLAN.md", async () => {
    const root = fixture("live");
    const client = fakeClient();
    const url = await runCreate({ slug: "kit", rootDir: root, client });
    expect(url).toBe("https://buy.polar.sh/abc");
    expect(client.ensureCheckoutLink).toHaveBeenCalledWith({ slug: "kit", productId: "p1", label: "The Kit" });
    expect(client.upsertDownloadableBenefit).toHaveBeenCalledWith({ slug: "kit", description: "Download The Kit", fileIds: ["f1"] });
    const plan = (await import("node:fs")).readFileSync(join(root, "products", "kit", "PLAN.md"), "utf8");
    expect(plan).toContain("polar_url: https://buy.polar.sh/abc");
    rmSync(root, { recursive: true, force: true });
  });
});
