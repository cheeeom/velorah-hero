# AGENTS.md — velorah-hero 知识入口

> 任何 AI 工具（Claude Code / Cursor / Windsurf / Copilot / WorkBuddy）接手前**必读**。
> 基准 commit：`0a63669`（v1.4.0，2026-09-11）。更新本文档时在下方「更新记录」注明。

## 更新记录
- 2026-09-11（二）：v1.4.0 修复批次完成。新增 hash 路由 / 字体与视频自托管 / 自动部署；修正结构地图行号；补充「Tailwind v4 颜色必须注册」铁律与 hash 路由说明。
- 2026-09-11（一）：初版，基准 `53477c4`（v1.3.0），全仓库扫描 + 部署链路核查产出。

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
| `src/content/site.ts` | **全部文案/数据**（导航、hero、成就、文章树、名言、联系方式、背景视频路径） | ★★★ 改内容只动这里 |
| `src/App.tsx`（~780 行） | 全部组件 + hash 路由（单文件，无 react-router） | ★★ 改 UI/交互 |
| `src/index.css`（~370 行） | `@theme` 字体与颜色令牌、CSS 变量（`:root` / `:root.light`）、liquid-glass、时间线、成长树、移动菜单 | ★★ 改样式 |
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

## 路由约定（v1.4.0 新增）
- URL 形如 `#/home`、`#/about`、`#/articles`、`#/contact`；非法 hash 回落首页
- `navigate()` 会写 hash（产生历史记录）+ `scrollTo(0)`；监听 `hashchange` 支持前进/后退
- **新增页面要三步**：`site.ts` 的 `PageId` 与 `navLinks` → `App.tsx` 的 `PAGE_IDS` → `pages` 映射表

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
- **P2｜SEO 基本裸奔**：无 `meta description`、无 OG 分享卡片（微信/微博分享是空白卡）、无 JSON-LD、无 sitemap/robots、每页无独立 title；纯 CSR，百度基本抓不到
- **P2｜性能**：`public/avatar.jpg` 46.5 kB 却只显示 96×96（应压成 WebP）；`backdrop-filter` 无 `@supports` 降级；`public/icons.svg` 5 kB 无引用却照样发布
- **P2｜无障碍**：`HeroHeading` 用 `<em className="not-italic">` 做配色 hack；叶子展开按钮缺 `aria-expanded`
- **P2｜死资源**：`src/assets/hero.png`、`react.svg`、`vite.svg` 无引用（不进产物，只脏仓库）
- **P2｜README.md 仍是 Vite 模板默认内容**
- **P3｜文章页是空壳**：6 篇只有标题+摘要，无正文页（最大价值缺口）
- **陷阱｜base 路径**：本地 dev 正常，但手工部署测试要记得 `base: '/velorah-hero/'`，资源 404 先查这个
- **陷阱｜Windows + 公司网络**：`git push` 直连不通，走代理 `http://192.168.8.70:9890`（已写入本仓库 git config；`.52` 那个代理是死的）
- **陷阱｜npm 装包**：用系统 node + 空 userconfig/globalconfig + 国内镜像，见 `PROGRESS.md` 开工清单

> 完整体检报告与修复优先级见 `AUDIT.md`；当前进度与待办见 `PROGRESS.md`。
