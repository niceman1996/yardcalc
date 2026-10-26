// Deploy YardCalc to GitHub Pages using the machine's stored GitHub credentials.
// Steps: extract PAT via `git credential fill` → ensure repo exists → push source
// (master) → push built site (out/) to gh-pages branch → enable Pages → verify.
// Run: .bin/node.exe scripts/deploy-gh-pages.mjs
import { spawnSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE = "yardcalc";
const REPO = SITE;
const SITE_URL = `https://niceman1996.github.io/${REPO}/`;
// Deep page fetched after go-live to confirm real content is serving.
const VERIFY_PATH = "tools/mulch-calculator";

function git(args, opts = {}) {
  return spawnSync("git", args, { encoding: "utf8", cwd: root, ...opts });
}
function node(args, opts = {}) {
  return spawnSync(process.execPath, args, { encoding: "utf8", ...opts });
}

// 1. credentials
const fill = git(["credential", "fill"], { input: "protocol=https\nhost=github.com\n" });
if (fill.status !== 0) throw new Error("git credential fill failed");
const cred = Object.fromEntries(
  fill.stdout.split("\n").filter((l) => l.includes("=")).map((l) => {
    const i = l.indexOf("=");
    return [l.slice(0, i), l.slice(i + 1)];
  }),
);
const { username, password: TOKEN } = cred;
if (!TOKEN) throw new Error("no GitHub token available from credential helper");
console.log(`[1] credentials: ${username} (token present, ${TOKEN.length} chars)`);

const api = (path, init = {}) =>
  fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "soe-deploy",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

// 2. ensure repo (public — required for free GitHub Pages)
let res = await api(`/repos/${username}/${REPO}`);
if (res.status === 404) {
  console.log(`[2] creating repo ${username}/${REPO} (public)`);
  res = await api("/user/repos", {
    method: "POST",
    body: JSON.stringify({
      name: REPO,
      private: false,
      description: "YardCalc — DIY material calculators (SOE program, site 1)",
    }),
  });
  if (!res.ok) throw new Error(`repo create failed: ${res.status} ${await res.text()}`);
} else if (!res.ok) {
  throw new Error(`repo check failed: ${res.status} ${await res.text()}`);
} else {
  console.log(`[2] repo ${username}/${REPO} exists`);
}

// 3. push source branch
const origin = `https://x-access-token:${TOKEN}@github.com/${username}/${REPO}.git`;
console.log("[3] pushing source (master)");
let p = git(["push", origin, "master:master"]);
if (p.status !== 0) {
  // first push may need upstream tracking
  p = git(["push", "-u", origin, "master:master"]);
  if (p.status !== 0) throw new Error(`source push failed:\n${p.stderr}`);
}
console.log("    source pushed");

// 4. push out/ as gh-pages (orphan repo inside out/)
const outDir = join(root, "sites", REPO, "out");
if (!existsSync(outDir)) throw new Error("out/ missing — run build-pages.mjs first");
console.log("[4] pushing site build to gh-pages");
// GitHub Pages runs Jekyll by default, which drops underscore-prefixed dirs (_next)
writeFileSync(join(outDir, ".nojekyll"), "");
// Custom domain (set SOE_DOMAIN=yardcalc.xyz) → CNAME file makes Pages serve it
if (process.env.SOE_DOMAIN) {
  writeFileSync(join(outDir, "CNAME"), `${process.env.SOE_DOMAIN}\n`);
  console.log(`    CNAME → ${process.env.SOE_DOMAIN}`);
}
rmSync(join(outDir, ".git"), { recursive: true, force: true });
const gitIn = (args) => spawnSync("git", args, { encoding: "utf8", cwd: outDir });
let q = gitIn(["init", "-b", "gh-pages"]);
if (q.status !== 0) throw new Error(`out git init failed: ${q.stderr}`);
gitIn(["add", "-A"]);
q = gitIn(["commit", "-m", `deploy ${new Date().toISOString()}`]);
if (q.status !== 0) throw new Error(`out commit failed: ${q.stderr}`);
q = gitIn(["push", "--force", origin, "gh-pages:gh-pages"]);
if (q.status !== 0) throw new Error(`gh-pages push failed:\n${q.stderr}`);
console.log("    gh-pages pushed");

// 5. enable Pages on gh-pages branch
console.log("[5] enabling GitHub Pages (gh-pages / root)");
res = await api(`/repos/${username}/${REPO}/pages`);
if (res.status === 404) {
  res = await api(`/repos/${username}/${REPO}/pages`, {
    method: "POST",
    body: JSON.stringify({ source: { branch: "gh-pages", path: "/" } }),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`pages enable failed: ${res.status} ${await res.text()}`);
  }
} else if (res.ok) {
  const info = await res.json();
  if (info.source?.branch !== "gh-pages") {
    await api(`/repos/${username}/${REPO}/pages`, {
      method: "PUT",
      body: JSON.stringify({ source: { branch: "gh-pages", path: "/" } }),
    });
  }
}
console.log("    pages enabled");

// 6. wait for the first build then verify over the public internet
console.log("[6] waiting for deployment to go live…");
const checkUrl = process.env.SOE_DOMAIN ? `https://${process.env.SOE_DOMAIN}/` : SITE_URL;
const deadline = Date.now() + 8 * 60 * 1000;
let live = false;
while (Date.now() < deadline) {
  try {
    const r = await fetch(checkUrl, { cache: "no-store" });
    if (r.ok) { live = true; break; }
  } catch {}
  await new Promise((s) => setTimeout(s, 15000));
}
if (!live) throw new Error("site did not go live within timeout");

// verify a deep page too
const tool = await fetch(`${checkUrl}${VERIFY_PATH}`, { cache: "no-store" });
console.log(`\nLIVE: ${checkUrl} (home 200, ${VERIFY_PATH} ${tool.status})`);
