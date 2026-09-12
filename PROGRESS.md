# PROGRESS.md — velorah-hero 进度

> 下一个 AI / 下一次会话从这里的「开工清单」开始。
> 基准：`v1.5.0`（SEO 批次，2026-09-12）。上一批 v1.4.0（工程修复）已推送。

## 当前状态速览
- 🟢 **本地已修复并提交（v1.5.0）**，`tsc` 零错误、oxlint 零警告、`npm run build` 通过
- 🟢 **已推送到 GitHub**：main、v1.1.0~v1.4.0 tag、自动部署工作流均已上云；v1.5.0 见本次会话记录
- 🟢 4 页面可用：首页（视频背景+名言轮播）/ 关于（头像+时间线+计数器）/ 文章（成长树）/ 联系（手机上现在也能进了）
- 🟢 外链依赖已清零（字体 + 视频均自托管，仅保留外链作为视频兜底）
- 🟢 SEO 基线已建立：分享卡片、每页标题、JSON-LD、robots、sitemap
- 🟢 浏览器自动化可用：agent-browser + Chrome 153 已装好（见「开工清单」第 9 条）

> 审阅结论与修复记录见同目录 `AUDIT.md`；版本历史见 `VERSION.md`。

## 待办队列
### P0 / P1
- [x] 全部完成，见 `AUDIT.md` 顶部状态表

### P2（打磨）
- [ ] 重写 README.md（现为 Vite 模板默认内容）
- [ ] `socialLinks` 里 GitHub 链接仍是 `'#'` 占位，补真实地址
- [x] ~~SEO：`meta description`、Open Graph 分享卡片、JSON-LD、`sitemap.xml`/`robots.txt`、每页独立 `title`~~（v1.5.0 已完成）
- [ ] 无障碍：`<main>` 已有，还缺 `aria-expanded` 之外的一些语义细节；`HeroHeading` 用 `<em className="not-italic">` 做配色 hack
- [ ] 性能：`avatar.jpg` 46.5 kB 显示 96px → 压成 WebP；`backdrop-filter` 加 `@supports` 降级
- [ ] 死资源清理：`src/assets/hero.png`、`react.svg`、`vite.svg`、`public/icons.svg`

### P3（内容与品牌）
- [ ] 文章正文页 + markdown 内容管线（当前 6 篇只有标题+摘要）
- [ ] 首屏补身份标签（3 秒自证：职业 / 地点 / 代表性成果）
- [ ] 简历 / 教学成果 PDF 下载
- [ ] 自定义域名（改 `vite.config.ts` 的 `base` 为 `/` + 添加 `CNAME`）
- [ ] 访问统计（Umami / Cloudflare Web Analytics）

### 待确认（需要老板拍板）
- [x] ~~英文名 `Chee Eom` 与"严其"不是拼音关系 —— 是品牌网名还是笔误？~~ **已确认（2026-09-12）：刻意品牌名。** 全站按品牌名处理 + `alternateName` 兼顾拼音。
- [x] ~~是否推送 v1.4.0 到 GitHub~~ **已推送**（main + 6 个 tag + Actions 工作流）。
- [ ] 关于页是否补一句 `Chee Eom` 的名字来历？（需老板提供说法）
- [ ] 是否上预渲染 / SSG 以改善百度收录（现在是纯 CSR，百度基本不收录）

## 开工清单（给下一个 AI）
1. 读 `AGENTS.md`（同目录）——5 分钟搞清楚结构，**不要**从零扫仓库；改之前读 `AUDIT.md`。
2. 改文案 → 只动 `src/content/site.ts`；改样式/交互 → `App.tsx` + `index.css`。
3. **新增颜色务必在 `index.css` 的 `@theme inline` 里登记**——Tailwind v4 对未注册类名静默忽略，曾导致 31 处颜色类全部失效（见 AUDIT P0-2）。
4. **本地跑起来**（环境有坑，照抄这套）：
   - 别用托管 node（跑 npm 会报 `Exit handler never called!`），用系统 node `C:\Program Files\nodejs\node.exe`。
   - npm 全局代理 `192.168.8.52:9890` **已失效（ETIMEDOUT）**，走国内镜像并清掉配置：
     `node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" --userconfig=<空文件> --globalconfig=<另一个空文件> --registry=https://registry.npmmirror.com install`
   - 两个空文件必须是**不同**的文件，否则 npm 报 `double-loading config` 直接退出。
   - 本地看效果：`node node_modules\vite\bin\vite.js preview --port 4173 --host 127.0.0.1`（注意默认只绑 IPv6，加 `--host 127.0.0.1`）
5. 完工后：`npm run lint` + `npm run build` 双绿 → 按变更类型打 tag 并更新 `VERSION.md` 与 `package.json`。
6. 部署：推送到 `main` 即由 GitHub Actions 自动发布；手动兜底 `npx gh-pages -d dist`。
7. push 走代理 `http://192.168.8.70:9890`（仓库 config 已配好；`.52` 那个是死的）。
8. 构建产物基线（v1.4.0）：JS 209.33 kB（gzip 66.41）、CSS 25.45 kB（gzip 5.96）、全站 1601.6 KB（含视频 0.97 MB + 海报 144 KB + 字体 191 KB）。
9. **要截图 / 浏览器验证时**：agent-browser + Chrome 153 已装好，浏览器在 `D:\a\2026-09-11-22-07-08\chrome153\chrome-win64\chrome.exe`。用法（**必须先把系统 node 顶到 PATH 最前**，否则 daemon 静默崩溃）：
   ```powershell
   $env:PATH = "C:\Program Files\nodejs;$env:APPDATA\npm;$env:PATH"
   agent-browser --executable-path "D:\a\2026-09-11-22-07-08\chrome153\chrome-win64\chrome.exe" set viewport 390 844
   agent-browser open http://127.0.0.1:4173/velorah-hero/
   agent-browser wait --load load ; agent-browser screenshot out.png ; agent-browser close
   ```
   ⚠️ **viewport 必须在 `open` 之前设**，open 之后再改（或页面内交互）会导致模拟视口失效、截图全白。完整踩坑记录见 skill `agent-browser-proxy-chrome`。

## 本次会话已完成（2026-09-11）
- [x] clone 仓库，通读全部源码与配置
- [x] 核查部署链路：gh-pages 与 main v1.3.0 同步
- [x] 产出 `AGENTS.md`（知识入口）
- [x] 产出 `AUDIT.md`（六维体检 + P0~P3 分级 + 三阶段路线）
- [x] **修复批次 v1.4.0**（commit `0a63669`）：移动端导航、颜色类失效、CSS 里的 JS 语法、FOUC、字体与视频自托管、hash 路由、自动部署
- [x] 补齐 git tag：v1.1.0 ~ v1.4.0（共 6 个）
- [x] 更新 `VERSION.md`、`package.json` 版本号
- [x] 视频压缩：13.49 MB → 0.97 MB（-92.8%）

## 本次会话已完成（2026-09-12）
- [x] 安装 agent-browser + Chrome 153（公司代理在 ~137MB 掐断下载 → HTTP Range 分块下载绕过）
- [x] 用 agent-browser 做视觉回归：桌面首页 / 移动端 390×844 / `#/about` `#/articles` `#/contact` 全部正常；确认 v1.4.0 的移动端汉堡菜单修复生效
- [x] 推送 `main` + 6 个 tag 到 GitHub；GitHub Actions 部署两连绿；线上 `index` / `bg.mp4` / `bg-poster.jpg` 均 200
- [x] 确认 `Chee Eom` 为刻意品牌名
- [x] **SEO 批次 v1.5.0**：OG/Twitter 分享卡片 + 品牌分享图 `og.jpg` + 每页 `title`/`description` + JSON-LD `Person` + `robots.txt`/`sitemap.xml` + `theme-color`/`canonical`
- [x] 更新 `AUDIT.md`（P2-2 标记完成）、`VERSION.md`（v1.5.0）、`PROGRESS.md`
