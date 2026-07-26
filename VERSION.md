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
| **MINOR** | 新增功能/页面、新特性 | v1.1.0 |
| **PATCH** | Bug 修复、样式微调、文案修改 | v1.0.1 |

---

## 版本历史

### v1.0.0 — 初始上线版本 `(2026-07-26)`

- **Commit**: `0d5482d`
- **Tag**: `v1.0.0`
- **状态**: 🟢 当前活跃版本 / 回退基准

**核心内容：**
- React 19 + Vite 8 + Tailwind CSS 4 + TypeScript
- Liquid Glass 毛玻璃暗色主题（深海军蓝配色）
- Instrument Serif 衬线字体 + Inter 无衬线字体
- 导航：首页 / 关于我 / 教学 / 写作 / 联系
- 首页：视频背景 + 标题动效 + 理念卡片
- 关于我：教育经历 + 成就时间线
- 教学页面：课程介绍 + 教学理念
- 写作页面：文章列表
- 联系页面：联系方式 + 社交链接
- 内容全部抽离到 `src/content/site.ts`

**部署方式：** GitHub Pages（`gh-pages` 分支）

---

## 更新流程

### 当你要更新网站时（经你同意后）

```bash
# 1. 确认当前版本
git describe --tags

# 2. 创建新分支开发
git checkout -b feature/xxx

# 3. 开发完成后合并回 main
git checkout main
git merge feature/xxx

# 4. 打新版本标签（根据变更类型选 MAJOR/MINOR/PATCH）
git tag -a v1.1.0 -m "v1.1.0 - 添加暗亮模式切换"

# 5. 推送到 GitHub
git push origin main --tags

# 6. 重新部署到 gh-pages
npm run build
npx gh-pages -d dist
```

### 回退到当前版本

```bash
# 如果需要回退到 v1.0.0
git checkout v1.0.0
npm run build
npx gh-pages -d dist
```

---

## 后续 TODO

- [ ] 完善首页响应式布局
- [ ] 添加暗色/亮色模式切换
- [ ] 添加成就时间线动效
- [ ] 添加名言轮播区
