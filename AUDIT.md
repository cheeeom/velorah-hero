# AUDIT.md — velorah-hero 优化体检报告

> 基准 commit：`53477c4`（v1.3.0）｜审阅日期：2026-09-11｜审阅方式：全量源码逐行 + 部署链路核查
> 结论先行：**视觉与设计语言是 A 级，工程质量是 C 级**。最扎眼的不是代码，是"移动端进不去联系页"这种低级缺陷躺了三个月。
> 优先级定义：P0 = 线上就是坏的；P1 = 硬伤/风险；P2 = 打磨；P3 = 内容与品牌增长。

---

## 🔧 修复状态（2026-09-11，v1.4.0 = commit `0a63669`）

| 编号 | 问题 | 状态 |
|---|---|---|
| P0-1 | 移动端导航半残、联系页进不去 | ✅ 已修（抽屉菜单） |
| P0-2 | **颜色工具类全部失效**（首轮遗漏，第二轮查出） | ✅ 已修（`@theme inline` 注册颜色令牌） |
| P1-1 | 字体走被墙的 Google Fonts | ✅ 已修（`@fontsource` 自托管 + 中文回退栈） |
| P1-2 | 背景视频押在第三方 CDN | ✅ 已修（自托管 0.97 MB + 海报 + 外链兜底） |
| P1-3 | 无深链、切页不回顶部 | ✅ 已修（hash 路由 + scrollTo） |
| P1-4 | 亮色主题首屏闪黑（FOUC） | ✅ 已修（`index.html` 内联脚本） |
| P1-5 | 部署纯手动、无 CI | ✅ 已修（GitHub Actions 自动部署） |
| P1-6 | 版本管理断档 | ✅ 已修（补齐 v1.1.0~v1.4.0 共 6 个 tag + VERSION.md + package.json） |
| P2-1 | CSS 里的 JS 语法 bug | ✅ 已修 |
| P2-4 | 字体内联、文案硬编码、`pages[page]()` 直调、定时器泄漏、avatar 硬编码 base | ✅ 已修（其余项见下） |
| P2-2 | SEO / 可发现性（meta description / OG / JSON-LD / 每页标题 / robots / sitemap） | ✅ 已修（v1.5.0） |
| P2-3 / P2-5 / P3 | 无障碍、性能、内容与品牌 | ⏳ 未处理，见对应章节 |

**修复后的构建实测**：`tsc` 零错误 · oxlint 0 warning / 0 error · 产物 JS 209.33 kB（gzip 66.41）、CSS 25.45 kB（gzip 5.96）、全站 1601.6 KB（含自托管视频 0.97 MB + 海报 144 KB）。
**首页传输量对比：视频从 13.49 MB 降到 0.97 MB（-92.8%），且移动端完全不加载视频（改为 144 KB 海报）。**

---

## P0 — 线上就是坏的

### P0-1 移动端导航半残，联系页在手机上根本进不去（✅ v1.4.0 已修）
**证据**（`src/App.tsx`）：
- L146 导航链接容器：`hidden md:flex` → <768px 全部隐藏
- L168 导航右侧 CTA：`hidden md:inline-flex` → 手机上也没有
- L174 汉堡按钮：`md:hidden` 显示，但 **没有 `onClick`，是个死按钮**（还带 `cursor-pointer`，点下去毫无反应，侮辱性极强）

**后果**：手机访客只能靠各页底部按钮在 home → about → articles 之间循环，`contact` 页没有任何入口。个人网站最重要的转化动作（联系我）在移动端是断的——而移动端才是主要流量。

**修法**：加 `mobileOpen` state + 抽屉菜单，汉堡按钮改 `aria-expanded` + `onClick`，菜单里复用 `navLinks`。

### P0-2 颜色工具类全部失效：全站"次要文字"没有变灰（✅ v1.4.0 已修）
> ⚠️ 这条是**首轮审阅漏掉、第二轮产物比对才查出来**的，记在这里当教训。

**证据**：源码里 `text-foreground` 用了 17 次、`text-muted-foreground` 14 次、`text-foreground/70` 与 `/40` 各 1 次，但**产物 CSS 里一条规则都没有**——`index.css` 从未把这些 HSL 变量注册成 Tailwind 颜色令牌（缺 `--color-*` 定义）。
**后果**：所有"次要文字"（副标题、日期、年份、提示语、社交链接）都退化成 `body` 继承的纯色，与标题一样亮 —— **整套视觉层级是平的**，这也是页面看起来"信息层级弱"的原因之一。浅色主题下的 `--muted-foreground` 同样从未生效。
**修法**：在 `index.css` 用 `@theme inline` 把 `--background/--foreground/--muted-foreground/--primary/...` 注册为 `--color-*`。
**⚠️ 踩坑提醒**：Tailwind v4 对未注册的类名**静默忽略**（不报错、不警告），开发期完全看不出来，只有比对产物 CSS 才能发现。以后新增颜色务必在 `@theme` 里登记。

---

## P1 — 硬伤与风险

> 以下 6 项 **v1.4.0 全部已修**（见顶部状态表）。保留原始记录，供日后回溯"当时为什么这么改"。

### P1-1 字体在国内很可能一直没加载成功（设计灵魂失效）✅
`src/index.css` L2 引用 `fonts.googleapis.com`，该域名在国内网络环境下被屏蔽或严重丢包（已核查：普遍表现为超时、回退系统字体）。
**已实测确认**：这条 `@import` **原样保留在构建产物 CSS 里**（`dist/assets/index-*.css` 顶部），意味着浏览器要先下载本站 CSS、才能发现这条跨域 @import，再去连 Google——**两次串行等待**，而国内大概率直接超时。
**后果**：Instrument Serif（这套设计的灵魂）+ Inter 在国内访客眼里**大概率是系统宋体/微软雅黑**，精心调的 `tracking-[-1.5px]`、字体对比全部落空。
**修法**（按推荐度）：
1. 自托管：`npm i @fontsource/instrument-serif @fontsource/inter`，`import` 进 `main.tsx`，删掉 CSS 里的 `@import url(...)`（首屏不再等第三方 DNS，也不泄 IP，合规更干净）；
2. 或改国内镜像 `fonts.loli.net` / `fonts.proxy.ustclug.org`（快，但仍依赖第三方，且是反代，长期不稳）。

### P1-2 首页背景视频押在别人的 CDN 上
`src/content/site.ts` L132：`src: 'https://d8j0ntlcm91z4.cloudfront.net/.../hf_...mp4'`（第三方 AI 生成服务的临时链接）。
**风险**：① 链接哪天失效，首页直接变成纯色空屏，没有任何兜底；② 视频元素无 `poster`（`App.tsx` L649），加载期间是黑的；③ 无 `preload` 策略，移动端自动播放白烧流量；④ 每一次访问都往第三方服务器递 IP。
**修法**：下载到 `public/bg.mp4`（建议压到 720p / 1.5MB 内），加 `poster="/velorah-hero/bg-poster.jpg"`，并给小屏提供降级（`@media (max-width:768px)` 用海报图替代视频）。

### P1-3 没有深链，切页不回顶部
`App.tsx` L644：`useState<PageId>('home')` —— 纯内存路由。
**后果**：① 刷新永远回首页，**任何页面都分享不出去**（发给家长/同事的链接落不到指定页）；② 在关于页（长内容）滚到底点"继续"，到文章页后滚动位置不重置，落在半空中。
**修法**：轻量 hash 路由（不引库，20 行）：`location.hash` ↔ `page` 双向同步 + `popstate` 监听 + 切换时 `window.scrollTo({top:0})`。

### P1-4 亮色主题用户每次进来先闪一下黑
`App.tsx` L24-27 在 `useState` 初始化里读 `localStorage`，但 L29-37 的 class 施加在 `useEffect` 里 —— 首帧已经画完了。
**修法**：`index.html` 的 `<head>` 里加一段内联脚本，在 React 之前把 `light` class 打到 `<html>` 上（3 行代码，消除 FOUC）。

### P1-5 部署纯手动，且 gh-pages 分支有垃圾
- `main` 推送不触发任何构建，必须本地跑 `npm run deploy`；忘了跑 = 线上是旧的；本地没更新 = 可能用旧代码覆盖线上。
- `gh-pages` 分支里残留 `.gitignore`、`.oxlintrc.json`（早期整库部署留下的），公开可见的脏东西。
**修法**：加 `.github/workflows/deploy.yml`（push main → `npm ci` → `npm run build` → 官方 Pages Action 发布），顺手在 CI 里跑 `tsc -b` 和 `oxlint` 当门禁。

### P1-6 版本管理断档（已记入 PROGRESS.md）
代码 v1.3.0，tag 停在 v1.0.0；`VERSION.md` 只写到 v1.0.0，TODO 里三项（暗色切换/时间线动效/名言轮播）其实早做完了；`package.json` 的 version 还是 `0.0.0`。
**修法**：补 5 个 tag，`npm version` 与 VERSION.md 对齐，CI 里校验。

---

## P2 — 打磨项

### P2-1 一个确凿的 CSS bug（当前无效代码）✅ 已修
`src/index.css` L250：
```css
transform: translateX(side === 'left' ? -20px : 20px);   /* ← JS 写进 CSS 了 */
```
`side` 是 JS 变量，浏览器解析失败 → **整条声明被丢弃**，叶子节点只有淡入没有横向滑入。已改为 `.tree-leaf-item.leaf-right` 类（`App.tsx` 同步加 `leaf-right`）。影响仅观感，但确实是个"复制粘贴事故"的化石。

### P2-2 SEO / 可发现性几乎零投入（✅ v1.5.0 已修）
- `index.html` 无 `meta description`、无 Open Graph / Twitter 卡片 → **微信、微博、QQ 分享出去是一张白卡片**（对教师个人品牌是白白浪费）
- `<html lang="en">`，内容全中文（对搜素引擎和屏幕阅读器都是错误信号）
- 无 `sitemap.xml` / `robots.txt`；无 JSON-LD `Person` 结构化数据（填了姓名/职业/地区，Google 上搜"严其 广元 教师"才有机会）
- 每页无独立 `document.title`
- **纯 CSR**：百度基本不执行 JS，收录趋近于 0。要么接受（国内流量靠微信转发），要么上预渲染（个人站推荐 `vite-plugin-prerender` 或干脆用 Astro 重写）

**✅ v1.5.0 修复结果**：
- `index.html` 补齐 `meta description` / `keywords` / `author` / `robots` / `canonical` / `theme-color`（亮暗两套）。
- 补齐 **Open Graph + Twitter 卡片**，并生成品牌分享图 `public/og.jpg`（1200×630）—— 分享出去不再是白卡片。
- 新增 **JSON-LD `Person`**（姓名 / 别名 / 职业 / 地区 / 邮箱 / 领域）。
- 每页独立 `document.title` 与 `meta description`（`site.ts` 的 `pageMeta` + `App.tsx` 一个 effect）。
- 新增 `public/robots.txt` 与 `public/sitemap.xml`。
- `lang="zh-CN"` 已在 v1.4.0 修好。
- **英文名已确认**：`Chee Eom` 是刻意的品牌网名，非拼音笔误 → 全站按品牌名处理，结构化数据用 `alternateName` 兼顾。
- ⏳ 仍未解决（属 P3）：纯 CSR 导致百度收录弱 → 待评估预渲染 / SSG。

### P2-3 无障碍
全站无 `prefers-reduced-motion` 处理（动效 + 自动播放视频对前庭敏感用户不友好）；缺 `<main>`/`<header>` 语义；背景视频缺 `aria-hidden="true"`；汉堡/叶子展开按钮缺 `aria-expanded`；`<em className="not-italic">` 用语义标签做配色 hack（HeroHeading L196）。

### P2-4 代码卫生（一次性 30 分钟能清完）
| 问题 | 位置 | 说明 |
|---|---|---|
| 死资源 | `src/assets/hero.png`(13KB)、`react.svg`、`vite.svg`、`public/icons.svg`(5KB) | 全无引用，可删 |
| 死变量 | `index.css` L8 `--font-display` | 定义了从没用（Tailwind 4 可用 `@theme` 注册成 `font-display` 工具类） |
| 字体内联 8 处 | `App.tsx` 各处 `style={{ fontFamily: "'Instrument Serif', serif" }}` | 应收进 CSS 变量/工具类 |
| 硬编码文案 | L170 `'开始探索'`、L444 `'获奖经历'`、L604 那句带 emoji 的副标题 | 违反"文案都在 site.ts"的自定约定 |
| 硬编码 base | L420 `/velorah-hero/avatar.jpg` | 应用 `import.meta.env.BASE_URL`，改仓库名/绑域名时才不会崩 |
| 未使用配置 | `site.ts` L120 `articles.placeholder` | 定义了没人用 |
| 版本号 | `package.json` `"version": "0.0.0"` | 与 VERSION.md 脱节 |
| 危险写法 | `App.tsx` L659 `pages[page]({ onNavigate: setPage })` | 直接调用组件函数而非 JSX。**现在能跑是因为 4 个页面组件恰好都没 hook**；谁哪天给页面加个 `useState`，就是 hook 顺序错乱 |
| 定时器泄漏 | `QuoteCarousel` L302-311 | `setInterval` 内的 `setTimeout` 未清理，卸载时可能对已卸载组件 setState |

### P2-5 性能（附实测产物数据）
构建产物实测：**JS 207.25 kB / gzip 65.81 kB**、CSS 22.96 kB / gzip 5.53 kB、`avatar.jpg` **46.5 kB**、`icons.svg` 5 kB（未使用却照样发布）——全站 276 kB。
- 对一个 4 页静态个人站，**65.8 kB gzip 的 JS 全是 React 运行时的代价**。能接受，但值得知道：如果哪天想追求极致，Astro / 纯 SSG 方案能把这个数字压到接近 0（顺带解决百度不执行 JS 的收录问题）。
- `public/avatar.jpg` 46.5 kB 却只显示 96×96 像素 —— 应压成 192×192 的 WebP（约 8 kB），或者干脆用 Vite 的 `?url` + `sharp` 处理。
- `public/icons.svg` 5 kB 无任何引用，但因为在 `public/` 里所以**照样进了产物**（`src/assets/` 下的死文件则不会进产物，只脏仓库）。
LCP 元素是背景视频与字体（都是外部资源）；`backdrop-filter: blur()` 铺在多个卡片 + 全屏视频叠加，在低端安卓上是掉帧重灾区。建议：给 `backdrop-filter` 加 `@supports` 降级、视频换 `poster` 且小屏不加载、字体自托管后 `font-display: swap`。

---

## P3 — 内容与品牌增长（个人网站真正的价值所在）

1. **文章页是空壳**——6 篇全是标题+摘要，没有正文页。这是最大的价值缺口：一个教育者的个人网站，灵魂就是"写出你相信的东西"。建议加 markdown 内容管线（`import.meta.glob('./content/posts/*.md')`），配合 P1-3 的 hash 路由做详情页。
2. **第一屏缺"3 秒自证"**：现在只有理念文案，没有可扫描的身份标签。建议标题下方补一行小字：`中职教师 · 广元｜指导学生获省级奖项 2 项` —— 让人三秒内知道你是谁、凭什么。
3. **缺实用资产**：简历/教学成果 PDF 下载（评职称、家长认识你时直接用得上）、公开课视频、学生作品墙。
4. **绑自定义域名**：现在挂在 `cheeeom.github.io/velorah-hero/` 子路径下，URL 又长又不像"个人品牌"。买个域名（`cheeeom.com` 之类）+ `CNAME` 文件，`base` 改 `/`，这是最直观的一步升级。
5. **加访问统计**：Umami / Cloudflare Web Analytics（无 cookie、隐私友好）。不知道谁来看，就没法迭代。
6. **邮箱明文暴露**被爬虫抓取（`846699191@qq.com` 公开在源码与页面上），QQ 邮箱风险可控，介意的话做轻量混淆。
7. **社交链接是 `'#'` 占位**（`site.ts` L126），GitHub 没填；也缺微信/公众号入口——国内访客的主要触达渠道。
8. ~~**待你确认**：英文名 `Chee Eom` 与"严其"（Yan Qi）不是拼音关系。~~ **已确认（2026-09-12）：`Chee Eom` 是刻意的品牌网名。** 全站按品牌名处理，结构化数据用 `alternateName` 兼顾拼音检索。**剩余建议**：在关于页补一句名字来历，避免访客困惑（需你提供说法）。

---

## 建议执行顺序（三阶段）

**第一阶段 · 止血（1 次提交能做完）**
P0-1 移动端导航 ｜ P1-4 FOUC ｜ P1-3 scroll-to-top（hash 路由可放二阶段）｜ P2-1 CSS bug ｜ P2-4 死资源清理

**第二阶段 · 稳固（工程基建）**
P1-1 字体自托管 ｜ P1-2 视频自托管 + poster ｜ P1-5 GitHub Actions 自动部署 ｜ P1-6 补 tag 与版本对齐 ｜ P2-2 SEO 元信息（description/OG/JSON-LD/lang）

**第三阶段 · 生长（内容与品牌）**
P3-1 文章正文管线 + 详情页 ｜ P1-3 hash 深链 ｜ P3-2 首屏身份标签 ｜ P3-4 自定义域名 ｜ P3-5 统计

---

## 附：本次审阅已验证事实
- **构建链路通**：`npm install`（91 包，36s）+ `npm run build`（`tsc -b` **零错误**，vite 446ms，18 modules）→ 产物 276 kB。代码质量没问题，问题都在工程基建和产品细节。
- gh-pages 最新部署 `2026-07-27 11:46`，紧跟 v1.3.0（11:35）→ 线上与 main 同步，**没有未部署的改动**
- 仓库内无任何硬编码密钥/token（`.gitignore` 正常忽略 `node_modules`/`dist`/`*.local`）
- 未引用的静态资源合计约 31KB 已确认可删（其中 `src/assets/` 的三个只脏仓库、不进产物；`public/icons.svg` 会进产物）
- `git tag` 仅 `v1.0.0`
- **环境坑**：npm 全局代理配的是 `http://192.168.8.52:9890`，实测 **ETIMEDOUT（已失效）**；git 能通的是 `192.168.8.70:9890`。用托管 node 跑 npm 还会报 `Exit handler never called!`。可用组合见 `PROGRESS.md` 开工清单。
