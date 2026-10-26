// Fill remaining GitHub Pages A-record IPs into the Aliyun dialog (one loop).
const DAEMON = "http://127.0.0.1:10086/command";
const SESSION = "zl1top-dns";
const IPS = ["185.199.109.153", "185.199.110.153", "185.199.111.153"];

async function cmd(action, args) {
  const r = await fetch(DAEMON, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, args, session: SESSION }),
  });
  const j = await r.json();
  if (!j.ok) throw new Error(`${action}: ${j.error?.message ?? JSON.stringify(j)}`);
  return j.data;
}
const sleep = (ms) => new Promise((s) => setTimeout(s, ms));

for (const ip of IPS) {
  await cmd("click", { selector: "@e672" }); // 添加条目
  await sleep(1500);
  const snap = await cmd("snapshot", { format: "aria", max_chars: 30000 });
  const tree = snap.tree_text ?? "";
  const seg = tree.slice(tree.indexOf("记录值集合"));
  // last empty 请输入记录值 textbox in the value table
  const re = /textbox "请输入记录值" \[ref=(e\d+)\](?:: ?([\d.]+))?/g;
  let m, target = null;
  while ((m = re.exec(seg))) {
    if (!m[2]) target = m[1]; // empty value box = newest row
  }
  if (!target) throw new Error(`no empty input found for ${ip}`);
  await cmd("fill", { selector: `@${target}`, value: ip });
  console.log(`filled ${ip} via @${target}`);
  await sleep(600);
}
console.log("ALL IPS FILLED");
