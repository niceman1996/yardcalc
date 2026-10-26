// Bind zl1.top as the GitHub Pages custom domain for niceman1996/yardcalc.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fill = spawnSync("git", ["credential", "fill"], {
  input: "protocol=https\nhost=github.com\n",
  encoding: "utf8",
  cwd: root,
});
const cred = Object.fromEntries(
  fill.stdout.split("\n").filter((l) => l.includes("=")).map((l) => {
    const i = l.indexOf("=");
    return [l.slice(0, i), l.slice(i + 1)];
  }),
);
const TOKEN = cred.password;
const api = async (path, init = {}) =>
  fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "soe-deploy",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });

const DOMAIN = "zl1.top";

// current Pages state
let res = await api("/repos/niceman1996/yardcalc/pages");
const cur = res.ok ? await res.json() : null;
console.log("current cname:", cur?.cname ?? "(none)", "| https:", cur?.https_enforced, "| status:", cur?.status);

if (cur?.cname !== DOMAIN) {
  console.log(`setting cname → ${DOMAIN}`);
  // update requires source too
  const put = await api("/repos/niceman1996/yardcalc/pages", {
    method: "PUT",
    body: JSON.stringify({ cname: DOMAIN, source: { branch: "gh-pages", path: "/" } }),
  });
  console.log("PUT pages:", put.status, put.ok ? "ok" : await put.text());
}

// check verification status
res = await api("/repos/niceman1996/yardcalc/pages");
if (res.ok) {
  const info = await res.json();
  console.log("cname:", info.cname, "| protected:", info.protected_branches, "| https_enforced:", info.https_enforced, "| status:", info.status);
  console.log("NOTE: enable_https needs a POST /pages/events {https_enabled:true} once cert is issued; DNS must verify first.");
}
