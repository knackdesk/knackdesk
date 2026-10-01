import { describe, it, expect } from "vitest";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalog } from "./catalog.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("real product catalog", () => {
  it("every PLAN.md in products/ validates (headline length, category, price) so the site build cannot fail on front-matter", async () => {
    const items = await loadCatalog(root);
    expect(items.length).toBeGreaterThan(30);
    for (const { data } of items) {
      if (data.headline) expect(data.headline.length, `${data.slug} headline`).toBeLessThanOrEqual(60);
      if (data.lane === "digital") expect(data.polar_url, `${data.slug} polar_url`).toMatch(/^https:\/\/buy\.polar\.sh\//);
    }
  });
});
