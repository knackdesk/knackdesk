import { defineConfig } from "vitest/config";
export default defineConfig({
  test: { include: ["scripts/**/*.test.js", "shared/**/*.test.js", "products/*/test/**/*.test.js"] },
});
