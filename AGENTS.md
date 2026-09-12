# AGENTS.md — velorah-hero 知识入口

> 任何 AI 工具（Claude Code / Cursor / Windsurf / Copilot / WorkBuddy）接手前**必读**。
> 基准 commit：v1.6.0（2026-09-12）。更新本文档时在下方「更新记录」注明。

## 更新记录
- 2026-09-12（二）：v1.6.0。新增 markdown 文章管线（`src/content/articles/*.md` 为唯一内容源）与文章详情页 `#/articles/<slug>`（marked 渲染）；获奖时间线加入 2026 苍溪县优秀学科教师；`index.html` 加 `<noscript>` 兜底；叶子节点补 `aria-expanded`。结构地图行号已偏移，以符号名为准。
- 2026-09-12（一）：v1.5.0 SEO 批次。新增 meta/OG/JSON-LD/robots/sitemap 与每页独立 title（元数据在 `site.ts` 的 `pageMeta`）；已知问题清单移除 SEO 条目。
- 2026-09-11（二）：v1.4.0 修复批次完成。新增 hash 路由 / 字体与视频自托管 / 自动部署；修正结构地图行号；补充「Tailwind v4 颜色必须注册」铁律与 hash 路由说明。

## 项目定位
**个人网站**（严其 / Chee Eom，教育从业者）：单页 React 应用，4 个页面（首页/关于/文章/联系），
Liquid Glass 毛玻璃暗色主题，部署在 GitHub Pages。
**线上地址**：https://cheeeom.github.io/velorah-hero/

## 技术栈
- React 19 + TypeScript ~6.0 + Vite 8 + Tailwind CSS 4（`@tailwindcss/vite` 插件，**无 tailwind.config**，主题全在 `index.css` 的 `@theme`）
- 字体：`@fontsource` 自托管（Instrument Serif + Inter，仅 latin 子集），**不要再引 CDN**
- Lint：oxlint（`.oxlintrc.json`）
- 部署：GitHub Actions 推 `main` 自动发布到 `gh-pages` 分支

## 文件清单
| 文件 | 作用 | 改动频率 |
|---|---|---|
| `src/content/site.ts` | **全部文案/数据**（导航、hero、成就、分类顺序/图标、名言、联系方式、背景视频路径、每页 SEO 元信息 `pageMeta`） | ★★★ 改内容只动这里 |
| `src/content/articles/*.md` | **文章唯一内容源**：frontmatter（`title / date / category / summary`）+ markdown 正文；新增文章 = 新增 md 文件，slug = 文件名 | ★★★ 写文章动这里 |
| `src/App.tsx`（~850 行） | 全部组件 + hash 路由（含文章详情 `#/articles/<slug>`，单文件，无 react-router） | ★★ 改 UI/交互 |
| `src/index.css`（~430 行） | `@theme` 字体与颜色令牌、CSS 变量（`:root` / `:root.light`）、liquid-glass、时间线、成长树、文章正文排版（`.article-content`）、移动菜单 | ★★ 改样式 |
| `src/main.tsx` | 入口 + 字体 import（4 个 latin 子集） | ★ |
| `public/bg.mp4`、`public/bg-poster.jpg` | 首页背景视频（1280x716 / 0.97 MB）与首帧海报 | ★ |
| `public/avatar.jpg` | 关于页头像（46.5 kB，偏大，待压缩） | ★ |
| `vite.config.ts` | `base: '/velorah-hero/'`（Pages 子路径，**删了站点就白屏**） | 别动 |
| `.github/workflows/deploy.yml` | 自动部署：lint → build → 发布 gh-pages | ★ |
| `VERSION.md` | 版本规范与历史（发版时同步更新） | 每次发版 |
| `AUDIT.md` | 问题清单与修复记录（P0~P3 分级） | 审阅后 |

## 结构地图（App.tsx，行号为 v1.4.0 快照，辅助定位用）
- 主题与通用 Hook：`useTheme`（L23，localStorage 键 `theme`）、`useScrollReveal`（L50）、`useCountUp`（L340）
- **路由**：`PAGE_IDS`（L78）、`readHash`（L81）、`useHashRoute`（L86）——纯 hash 路由，形如 `#/about`
- **背景视频**：`BackgroundVideo`（L117）——小屏与 `prefers-reduced-motion` 时直接返回 null
- 基础组件：`Logo`(L151) `ThemeToggle`(L174) `Navbar`(L199，含移动端抽屉) `HeroHeading`(L322) `Counter`(L361) `CELogo`(L379) `PageShell`(L416) `QuoteCarousel`(L428) `TimelineItem`(L501) `LeafNode`(L622) `TreeBranch`(L669)
- 页面：`HomePage`(L468) `AboutPage`(L539) `ContactPage`(L601) `ArticlesPage`(L716)
- 页面映射与入口：`pages`(L760) + `App`(L767)

## 路由约定（v1.6.0 更新）
- URL 形如 `#/home`、`#/about`、`#/articles`、`#/contact`，文章详情为 `#/articles/<slug>`；非法 hash 回落首页
- `navigate(id, article?)` 会写 hash（产生历史记录）+ `scrollTo(0)`；监听 `hashchange` 支持前进/后退
- **新增页面要三步**：`site.ts` 的 `PageId` 与 `navLinks` → `App.tsx` 的 `PAGE_IDS` → `pages` 映射表
- **新增文章只需一步**：在 `src/content/articles/` 放一个 md 文件（frontmatter + 正文）；分类顺序/图标在 `site.ts` 的 `categoryOrder` / `categoryIcons` 登记，未登记的新分类自动排到最后

## 主题与样式约定
- 亮暗主题靠 `<html class="light">` 切换；首屏由 `index.html` 内联脚本提前施加（修 FOUC，别删）
- 字体用工具类 `font-display`（衬线标题）/ `font-body`（正文），**不要写内联 `style={{fontFamily}}`**
- ⚠️ **Tailwind v4 铁律**：类名若引用未注册的颜色会被**静默忽略**（不报错）。新增颜色必须在 `index.css` 的
  `@theme inline { --color-xxx: hsl(var(--xxx)); }` 里登记。历史上因为漏了这一步，`text-muted-foreground` 等
  31 处类名全部失效，次要文字没有变灰（见 `AUDIT.md` P0-2）
- 玻璃质感统一样式在 `.liquid-glass`；时间线/成长树的动效类是 `timeline-*` / `tree-*` / `leaf-*`

## 部署机制
1. 推送到 `main` → GitHub Actions 自动 `npm ci` → `lint` → `build` → 发布到 `gh-pages` 分支
2. Pages 从 `gh-pages` 分支发布（沿用原配置，**无需改仓库设置**）
3. 手动兜底：`npx gh-pages -d dist`（忘了推 main 或 Action 失败时用）
4. 注意：`npm run build` 依赖 `base: '/velorah-hero/'`，若将来绑自定义域名要同步改成 `/`

## 已知问题（v1.4.0 后仍存在的）
- **P2｜SEO 已补基础（v1.5.0）**：`meta description` / OG+Twitter 卡片 / 品牌分享图 `public/og.jpg` / JSON-LD `Person` / `robots.txt` / `sitemap.xml` / 每页独立 `title` 均已就位。**剩余**：纯 CSR → 百度收录仍弱（待评估预渲染 / SSG）。
  ⚠️ `canonical`、`og:url`、`og:image` 是绝对地址，绑定自定义域名后需同步改 `index.html`。
  ℹ️ 品牌名：`严其`（中文名）+ `Chee Eom`（**刻意的英文品牌网名**，非拼音）；SEO 元信息两者都要覆盖，结构化数据用 `alternateName` 兼顾。
- **P2｜性能**：`public/avatar.jpg` 46.5 kB 却只显示 96×96（应压成 WebP）；`backdrop-filter` 无 `@supports` 降级；`public/icons.svg` 5 kB 无引用却照样发布
- **P2｜无障碍**：`HeroHeading` 用 `<em className="not-italic">` 做配色 hack（叶子 `aria-expanded` 已于 v1.6.0 补上）
- **P2｜死资源**：`src/assets/hero.png`、`react.svg`、`vite.svg` 无引用（不进产物，只脏仓库）
- **P2｜README.md 仍是 Vite 模板默认内容**
- **P3｜文章正文为 AI 初稿（v1.6.0）**：管线与详情页已就位，但 7 篇正文需站长审校改写后才是真正的内容资产；RSS/评论/搜索待文章稳定后再加
- **陷阱｜noscript 兜底内容**：`index.html` 里给无 JS 爬虫的获奖/文章清单是手写快照，改动 `site.ts` 后记得同步
- **陷阱｜base 路径**：本地 dev 正常，但手工部署测试要记得 `base: '/velorah-hero/'`，资源 404 先查这个
- **陷阱｜Windows + 公司网络**：`git push` 直连不通，走代理 `http://192.168.8.70:9890`（已写入本仓库 git config；`.52` 那个代理是死的）
- **陷阱｜npm 装包**：用系统 node + 空 userconfig/globalconfig + 国内镜像，见 `PROGRESS.md` 开工清单

> 完整体检报告与修复优先级见 `AUDIT.md`；当前进度与待办见 `PROGRESS.md`。
