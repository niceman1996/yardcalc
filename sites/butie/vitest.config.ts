import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@/lib": resolve(__dirname, "./lib"),
      "@/shared": resolve(__dirname, "../../packages/shared/src"),
    },
  },
});
