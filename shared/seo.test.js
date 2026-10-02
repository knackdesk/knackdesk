import { describe, it, expect } from "vitest";
import { productNode } from "./seo.js";

describe("productNode merchant fields", () => {
  it("includes brand, sku, image, availability, a return policy and shipping details so Search Console merchant checks pass", () => {
    const n = productNode({ name: "Kit", description: "d", price_cents: 1200, polar_url: "https://buy.polar.sh/x", slug: "kit-x" }, "https://knackdesk.com/kits/img/kit-x/cover.png");
    expect(n.brand).toEqual({ "@type": "Brand", name: "Knackdesk" });
    expect(n.sku).toBe("kit-x");
    expect(n.image).toBe("https://knackdesk.com/kits/img/kit-x/cover.png");
    expect(n.offers.availability).toBe("https://schema.org/InStock");
    expect(n.offers.hasMerchantReturnPolicy["@type"]).toBe("MerchantReturnPolicy");
    expect(n.offers.hasMerchantReturnPolicy.returnPolicyCategory).toBe("https://schema.org/MerchantReturnNotPermitted");
    expect(n.offers.shippingDetails["@type"]).toBe("OfferShippingDetails");
    expect(n.offers.shippingDetails.shippingRate.value).toBe(0);
    expect(n).not.toHaveProperty("aggregateRating");
    expect(n).not.toHaveProperty("review");
  });
  it("omits image when none is given", () => {
    expect(productNode({ name: "K", description: "d", price_cents: 900, polar_url: "u", slug: "k" })).not.toHaveProperty("image");
  });
});
