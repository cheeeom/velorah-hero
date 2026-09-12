# 🏷️ 个人网站版本管理

> 项目：velorah-hero（严其 / Chee Eom）
> 仓库：https://github.com/cheeeom/velorah-hero
> 部署：https://cheeeom.github.io/velorah-hero/

---

## 版本规范

遵循语义化版本 [SemVer 2.0](https://semver.org/)：

```
vMAJOR.MINOR.PATCH
```

| 字段 | 何时递增 | 示例 |
|------|---------|------|
| **MAJOR** | 页面结构/UI 大改、有破坏性变更 | v2.0.0 |
| **MINOR** | 新增功能/页面、新特性 | v1.4.0 |
| **PATCH** | Bug 修复、样式微调、文案修改 | v1.4.1 |

> 发版时同步三处：`package.json` 的 `version`、本文件的版本历史、git tag。

---

## 版本历史

### v1.6.0 — 文章内容管线 + 新获奖 `(2026-09-12)`

- **状态**: 🟢 当前活跃版本

**新增：**
- ✨ **Markdown 文章管线**：`src/content/articles/*.md` 成为文章唯一内容源（frontmatter：`title / date / category / summary`，正文 markdown），成长树与详情页由内容自动生成——新增文章 = 新增一个 md 文件，无需改组件。分类顺序/图标在 `site.ts` 的 `categoryOrder` / `categoryIcons` 登记，未登记的新分类自动排到最后。
- ✨ **文章详情页**：路由扩展为 `#/articles/<slug>`（slug = md 文件名），`marked` 渲染正文；每篇独立的 `document.title` 与 meta description，支持分享链接刷新直达、浏览器前进后退。
- ✨ **新获奖**：2026 苍溪县优秀学科教师（关于页时间线、个人称号计数器 2→3、JSON-LD `award` 数组、`<noscript>` 兜底内容同步）。
- ✨ `index.html` 增加 `<noscript>` 兜底：不执行 JS 的爬虫（百度等）至少可读到简历级文字内容。
- ✨ 叶子节点补 `aria-expanded`；展开面板移出按钮外层（避免 button 嵌套 button），新增"阅读全文"入口。

**依赖：** 新增 `marked`（markdown 渲染，零依赖；JS 209→266 kB，gzip 66→86 kB）。

> ⚠️ 7 篇文章正文为 AI 起草初稿，署名发布前需站长本人审校改写。

---

### v1.5.0 — SEO 与可发现性 `(2026-09-12)`

- **状态**: 🟢 当前活跃版本

**新增：**
- ✨ **Open Graph / Twitter 分享卡片**：微信 / QQ / 微博 / 飞书 转发不再是白卡片。
- ✨ **品牌分享图** `public/og.jpg`（1200×630，深青底 + CE 徽标 + 衬线标题 + 一句理念 + "中职教师 · 四川广元"）。
- ✨ **每页独立 `document.title` 与 `meta description`**：首页 / 关于 / 文章 / 联系 各不相同，便于单页分享与收录。
- ✨ **JSON-LD `Person` 结构化数据**：声明姓名（严其 / Chee Eom）、职业（中职教师）、地区（四川广元）、邮箱与领域。
- ✨ `robots.txt` + `sitemap.xml`；`meta theme-color`（亮/暗两套）、`canonical`、`author`、`keywords`。

**说明：**
- 英文名 `Chee Eom` 经确认是**刻意的品牌网名**（并非"严其"的拼音），故全站按品牌名对待，并在结构化数据里以 `alternateName` 声明，兼顾拼音检索。
- ⚠️ `canonical` / `og:url` / `og:image` 是绝对地址，**绑定自定义域名后需同步更新**（`index.html`）。

---

### v1.4.0 — 工程修复批次 `(2026-09-11)`

- **Tag**: `v1.4.0`

**修复：**
- 🐛 **移动端导航失效**：汉堡按钮原本没有点击事件，且导航链接/CTA 在手机上全部隐藏 → 手机访客无法进入"联系"页。现已补全抽屉菜单。
- 🐛 **颜色工具类全部失效**：`text-foreground` / `text-muted-foreground` 等 31 处类名未在 Tailwind 中注册，产物 CSS 里 0 条规则 → 次要文字没有变灰、设计层级被压平。已在 `index.css` 用 `@theme inline` 注册颜色令牌。
- 🐛 **叶子节点动画失效**：`index.css` 里 `translateX(side === 'left' ? ...)` 把 JS 语法写进了 CSS，整条声明被浏览器丢弃。
- 🐛 **亮色主题首屏闪黑（FOUC）**：`light` class 现在改在 `index.html` 内联脚本里提前施加。

**新增：**
- ✨ 字体自托管（`@fontsource`），移除被墙的 `fonts.googleapis.com` 依赖；补全中文字体回退栈。
- ✨ Hash 路由（`#/about` 等）：页面可分享、刷新不丢、支持前进后退；切页自动回到顶部。
- ✨ 背景视频：小屏不加载、尊重"减少动效"偏好、加载失败自动退场；新增海报图。
- ✨ GitHub Actions 自动部署：推送到 `main` 即构建并发布到 `gh-pages`。
- ✨ `prefers-reduced-motion` 支持；移动端菜单可 Esc 关闭。

**其它：** 文案全部收回 `src/content/site.ts`；`pages[page]({...})` 改为标准 JSX 渲染（消除 hook 顺序隐患）；修复名言轮播定时器泄漏。

---

### v1.3.0 — 成长树文章页 `(2026-07-27)`

- **Commit**: `53477c4`
- **内容**：文章页改为"成长树"布局（枝干 + 叶子节点，点击展开摘要）

### v1.2.2 — 关于页头像 `(2026-07-27)`

- **Commit**: `b217207`
- **内容**：头像 + 渐变光环

### v1.2.1 — 内容排版调整 `(2026-07-27)`

- **Commit**: `321f8e5`
- **内容**：名言移到文章页、计数器修正为 2、时间线卡片增强

### v1.2.0 — 时间线 / 主题切换 / 名言轮播 `(2026-07-27)`

- **Commit**: `9fb644e`
- **内容**：成就时间线动效、暗色/亮色切换、CE 徽标与 favicon

### v1.1.0 — 交互增强 `(2026-07-27)`

- **Commit**: `56a75ce`
- **内容**：时间线、明暗主题切换、名言轮播

### v1.0.0 — 初始上线版本 `(2026-07-26)`

- **Commit**: `0d5482d`
- **Tag**: `v1.0.0`
- **内容**：React 19 + Vite + Tailwind + TS；Liquid Glass 暗色主题；首页 / 关于 / 教学 / 写作 / 联系；内容抽离到 `src/content/site.ts`；部署 `gh-pages` 分支

---

## 部署方式

**推荐（自动化）**：把改动推到 `main`，GitHub Actions 会自动跑 `lint → build → 发布 gh-pages`。
在仓库 Actions 页可看到运行记录；也支持手动 `workflow_dispatch` 触发。

**手动兜底**：

```bash
npm run build
npx gh-pages -d dist
```

### 回退到历史版本

```bash
git checkout v1.3.0
npm run build
npx gh-pages -d dist
```

---

## 后续 TODO

- [ ] 文章正文页（目前只有标题 + 摘要，无详情路由）
- [ ] 首屏补身份标签（三秒自证：职业 / 地点 / 代表性成果）
- [ ] 简历 / 教学成果 PDF 下载入口
- [ ] 自定义域名（改 `vite.config.ts` 的 `base` 为 `/` 并添加 `CNAME`）
- [ ] 访问统计（隐私友好型，如 Umami / Cloudflare Web Analytics）
- [x] ~~SEO：meta description、Open Graph 分享卡片、JSON-LD~~（v1.5.0 已完成）
- [ ] 头像压缩（当前 46.5 kB 却只显示 96px）
- [ ] 死资源清理：`src/assets/hero.png`、`react.svg`、`vite.svg`、`public/icons.svg`
