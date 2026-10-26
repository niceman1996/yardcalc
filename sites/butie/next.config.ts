import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@soe/shared"],
  images: { unoptimized: true },
  // The parent directory has an unrelated lockfile; pin the workspace root here.
  outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
  // Set when deploying under a subpath (e.g. GitHub Pages project site).
  ...(process.env.NEXT_PUBLIC_BASE_PATH
    ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH }
    : {}),
};

export default nextConfig;
