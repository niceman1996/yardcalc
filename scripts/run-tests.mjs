// Run vitest for every site directly through the calling node binary
// (process.execPath). On this machine pnpm's bin shims resolve `node` from
// PATH (the EPERM-intercepted G:\kit interpreter), so tests must not go
// through `pnpm run`. Usage: .bin/node.exe scripts/run-tests.mjs
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sites = ["yardcalc"];

let failed = 0;
for (const site of sites) {
  const vitest = join(root, "sites", site, "node_modules", "vitest", "vitest.mjs");
  if (!existsSync(vitest)) {
    console.error(`[test] ${site}: vitest not installed — run install first`);
    failed++;
    continue;
  }
  console.log(`\n=== tests: ${site} ===`);
  const r = spawnSync(process.execPath, [vitest, "run"], {
    stdio: "inherit",
    cwd: join(root, "sites", site),
  });
  if (r.status !== 0) failed++;
}
console.log(`\n[test] ${sites.length - failed}/${sites.length} sites passed`);
process.exit(failed ? 1 : 0);
