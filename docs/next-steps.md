# 下一步操作指引（锤大哥专属，两个 5 分钟）

> 现状：站 1 已上线 https://niceman1996.github.io/yardcalc/ ，全部材料数据已核实（DATA_VERIFIED=true）。
> 以下两件事只有你能做（需要登录/付款），做完各 5 分钟，其余全自动。

## 一、Google Search Console 提交（SEO 起量第一脚油门）

1. 打开 https://search.google.com/search-console ，用你的 Google 账号登录
2. 「添加资源」→ 选 **网址前缀** → 填 `https://niceman1996.github.io/yardcalc`
3. 验证方式选 **HTML 标记**：Google 会给一段 `<meta name="google-site-verification" content="xxxx" />`
4. 把 content 值发给 agent（或贴在 tasks 消息里），我加进 `layout.tsx` 重新部署
   （备选：HTML 文件验证——下载的文件放到 `sites/yardcalc/public/` 里，告诉 agent 文件名即可）
5. 验证通过后：左侧「站点地图」→ 提交 `https://niceman1996.github.io/yardcalc/sitemap.xml`
6. 之后 2-4 周在「效果」报告看收录和 impressions

## 二、买域名 + 一条命令切换（建议现在就做，$1-3/年）

**探测结果（2026-10-26，RDAP 实查）**：

| 域名 | 状态 | 建议价 |
|---|---|---|
| **yardcalc.xyz** | ✅ 可注册（推荐：品牌完全匹配） | 首年 ~$1-3 |
| yardcalc.top | ✅ 可注册（备选） | 首年 ~$1-3 |
| yardcalc.org | ✅ 可注册（更稳但贵些） | ~$8-10/年 |
| yardcalc.com / .net | ❌ 已被注册 | — |

购买渠道：Porkbun（https://porkbun.com ，便宜、免费隐私保护）或 Cloudflare Registrar（成本价）。

**买完后切域名（agent 全自动，你只需在域名商后台加 2 条 DNS）**：

```
DNS 设置（在 Porkbun/CF 域名管理页）：
  A     @      185.199.108.153
  A     @      185.199.109.153
  A     @      185.199.110.153
  A     @      185.199.111.153
  CNAME www    niceman1996.github.io
```

然后告诉 agent 域名，执行：

```bash
export SOE_DOMAIN=yardcalc.xyz
./.bin/node.exe scripts/build-pages.mjs      # 根域名模式构建（无 basePath）
./.bin/node.exe scripts/deploy-gh-pages.mjs  # 自动写 CNAME + 推送 + 验证
```

HTTPS 证书 GitHub Pages 自动签发（Let's Encrypt），无需操作。

## 三、已排期事项（无需操作，agent 按节奏推进）

- **站 2（工资计算矩阵）**：spec 第 2 周——40 时薪档位 × 200+ 程序化页 + 50 州税后计算
- **站 3（创作者计算器）**：spec 第 3 周——12-15 个工具
- **AdSense**：GSC 收录 + 有真实流量后申请（合规页已内置）
- 域名切换后 GSC 记得添加新域名资源并做地址变更（agent 会提醒）

## 附:本项目常用命令

```bash
cd G:/ai/projects/seo-tool-sites
./.bin/node.exe scripts/run-tests.mjs                 # YardCalc tests (run directly to avoid blocked node shims; see log.md #6)
./.bin/node.exe scripts/build-pages.mjs               # Build YardCalc
./.bin/node.exe scripts/deploy-gh-pages.mjs           # Deploy YardCalc + public verification
node scripts/serve-static.mjs sites/yardcalc/out 8080  # 本地预览
```

（注意：本机必须用 `.bin/node.exe`，直接 node/pnpm 会被系统策略拦写——见 docs/log.md）
