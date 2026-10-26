// Build YardCalc for GitHub Pages.
//   Default: project-site subpath (https://<user>.github.io/<site>).
//   Custom domain: set SOE_DOMAIN (e.g. yardcalc.xyz) — builds for the domain
//   root (no basePath). Run with the local node copy:
//   .bin/node.exe scripts/build-pages.mjs
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE = "yardcalc";
const site = join(root, "sites", SITE);

const domain = process.env.SOE_DOMAIN;
const env = domain
  ? { ...process.env, NEXT_PUBLIC_SITE_URL: `https://${domain}`, NEXT_PUBLIC_BASE_PATH: "" }
  : {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: `https://niceman1996.github.io/${SITE}`,
      NEXT_PUBLIC_BASE_PATH: `/${SITE}`,
    };

console.log(
  domain
    ? `[build:${SITE}] custom domain mode: https://${domain} (no basePath)`
    : `[build:${SITE}] project-site mode: niceman1996.github.io/${SITE} (basePath /${SITE})`,
);

const r = spawnSync(
  process.execPath,
  [join(site, "node_modules", "next", "dist", "bin", "next"), "build"],
  { stdio: "inherit", env, cwd: site },
);
process.exit(r.status ?? 1);
