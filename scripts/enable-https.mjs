// Wait for the Let's Encrypt cert on zl1.top, then enable Enforce HTTPS.
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
const api = async (path, init = {}) =>
  fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cred.password}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "soe-deploy",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });

const deadline = Date.now() + 45 * 60 * 1000;
let httpsOk = false;
while (Date.now() < deadline) {
  try {
    const r = await fetch("https://zl1.top/", { cache: "no-store" });
    if (r.ok) { httpsOk = true; break; }
  } catch {}
  await new Promise((s) => setTimeout(s, 30000));
}
if (!httpsOk) {
  console.log("HTTPS_CERT_TIMEOUT: cert not live in 45min — rerun this script later");
  process.exit(2);
}
console.log("HTTPS live on zl1.top");

// enable Enforce HTTPS
const ev = await api("/repos/niceman1996/yardcalc/pages/events", {
  method: "POST",
  body: JSON.stringify({ https_enabled: true }),
});
console.log("enable https event:", ev.status, ev.ok ? "accepted" : await ev.text());

await new Promise((s) => setTimeout(s, 20000));
const info = await (await api("/repos/niceman1996/yardcalc/pages")).json();
console.log("https_enforced:", info.https_enforced, "| status:", info.status);

// final checks
for (const u of ["https://zl1.top/", "https://zl1.top/tools/mulch-calculator", "https://niceman1996.github.io/yardcalc/"]) {
  const r = await fetch(u, { redirect: "manual", cache: "no-store" });
  console.log(r.status, u, r.headers.get("location") ?? "");
}
