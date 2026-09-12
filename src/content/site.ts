/**
 * ████████████████████████████████████████████████████
 * 个人网站配置 —— 改这里的内容就行，不用碰组件代码！
 * 改完保存，页面自动热更新。
 * ████████████████████████████████████████████████████
 */

/** ── 品牌信息 ── */
export const brand = {
  nameCN: '严其',
  nameEN: 'Chee Eom',
  suffix: null as string | null,
}

/** ── 页面定义 ── */
export type PageId = 'home' | 'about' | 'contact' | 'articles'

export interface NavItem {
  label: string
  target: PageId
}

export const navLinks: NavItem[] = [
  { label: '首页', target: 'home' },
  { label: '关于', target: 'about' },
  { label: '文章', target: 'articles' },
  { label: '联系', target: 'contact' },
]

/** ── 首页 Hero ── */
export const hero = {
  headingParts: [
    { text: '在' },
    { text: '教育', highlight: true },
    { text: '的旷野，' },
    { text: '' },
    { text: '种下' },
    { text: '另一种可能。', highlight: true },
  ] as { text: string; highlight?: boolean }[],

  subtitle: [
    '我是严其，一名教育从业者。',
    '在这片被标准答案驯化的土地上，我选择做那个播种的人——',
    '为独立思考破土，为创造力的野性生长。',
  ].join('\n'),

  heroCta: '走进我的世界',
  navCta: '开始探索', // 首页导航按钮文案
  navCtaAlt: '开始探索', // 其他页导航按钮文案（目前与首页相同，可各改各的）
}

/** ── 关于页 ── */
export const about = {
  title: '关于我',
  intro: '一名扎根一线的教育实践者。\n相信教育不是灌满一桶水，而是点燃一团火。',
  achievements: [
    { year: '2026', text: '苍溪县优秀学科教师', icon: '🏅' },
    { year: '2025', text: '广元市教师能力大赛一等奖', icon: '🏆' },
    { year: '2023/2026', text: '指导学生分获四川省职业技能大赛二等奖、三等奖', icon: '🎯' },
    { year: '累计', text: '指导学生获市级、县级奖励 20 余次', icon: '📊' },
    { year: '荣誉', text: '优秀指导教师称号 · 教坛新秀称号', icon: '⭐' },
  ] as { year: string; text: string; icon: string }[],
  continueBtn: '继续',
  achievementsTitle: '获奖经历',
}

/** ── 联系页 ── */
export const contact = {
  title: '联系我',
  email: '846699191@qq.com',
  hint: '点击邮箱可直接发送',
}

/** ── 文章页 ──
 * 内容源是本目录下 articles/*.md：frontmatter 写 title / date / category / summary，
 * 正文为 markdown。新增文章 = 新增一个 md 文件，列表与详情页自动生成，不用改组件。
 * ponytail: frontmatter 解析只支持「key: value」单行格式（不支持嵌套/多行值），
 * 现有内容够用；将来需要 YAML 高级语法时再换 gray-matter。 */
export interface ArticleItem {
  slug: string
  title: string
  date: string
  category: string
  summary: string
  body: string
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { meta: {}, body: raw.trim() }
  const meta: Record<string, string> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: m[2].trim() }
}

const mdFiles = import.meta.glob('./articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const articleList: ArticleItem[] = Object.entries(mdFiles)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const { meta, body } = parseFrontmatter(raw)
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '',
      category: meta.category ?? '随笔',
      summary: meta.summary ?? '',
      body,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date)) // 新文章在前

export const articlesBySlug: Record<string, ArticleItem> = Object.fromEntries(
  articleList.map((a) => [a.slug, a]),
)

export interface ArticleBranch {
  category: string
  icon: string
  articles: ArticleItem[]
}

/** 成长树上的分类顺序与图标；未列出的新分类自动排在最后、默认叶子图标 */
const categoryOrder = ['教育随笔', '教学实践', '读书笔记', '成长反思']
const categoryIcons: Record<string, string> = {
  教育随笔: '✍️',
  教学实践: '🌱',
  读书笔记: '📖',
  成长反思: '🌿',
}

export const articleTree: ArticleBranch[] = [...new Set(articleList.map((a) => a.category))]
  .sort((a, b) => {
    const ia = categoryOrder.indexOf(a)
    const ib = categoryOrder.indexOf(b)
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib)
  })
  .map((category) => ({
    category,
    icon: categoryIcons[category] ?? '🌿',
    articles: articleList.filter((a) => a.category === category),
  }))

export const articles = {
  title: '文章',
  leafHint: '每一篇文章，都是一片生长的叶子 🌱',
  readMore: '阅读全文 →',
  notFound: '这片叶子还在生长中……',
  backBtn: '回到首页',
  backToList: '回到文章',
}

/** ── 每页 SEO 元信息 ──
 * 供 App 在切换 hash 路由时更新 document.title / meta description，
 * 让每个页面都能被单独分享、且标题各不相同。 */
export const pageMeta: Record<PageId, { title: string; description: string }> = {
  home: {
    title: '严其 · Chee Eom ｜ 教育不是灌满一桶水，而是点燃一团火',
    description:
      '严其（Chee Eom）的个人网站 —— 扎根四川广元一线的中职教育者，记录教育随笔、教学实践与成长反思。',
  },
  about: {
    title: '关于我 · 严其 Chee Eom',
    description:
      '严其（Chee Eom），四川广元中职教师。2026 苍溪县优秀学科教师，广元市教师能力大赛一等奖，指导学生获四川省职业技能大赛二等奖、三等奖。',
  },
  articles: {
    title: '文章 · 严其 Chee Eom',
    description: '教育随笔、教学实践、读书笔记与成长反思 —— 严其的文字集。',
  },
  contact: {
    title: '联系我 · 严其 Chee Eom',
    description: '欢迎交流教育、教学与合作。可通过邮箱联系严其（Chee Eom）。',
  },
}

/** ── 社交链接 ── */
export const socialLinks = [
  { label: 'GitHub', href: '#' },
  { label: 'Email', href: 'mailto:846699191@qq.com' },
] as const

/** ── 视频背景 ──
 * 优先使用随站点发布的自托管文件（不依赖第三方链接存活）；
 * 若自托管文件缺失，浏览器会自动回落到 fallbackSrc 的原始外链。
 * poster 是首帧海报：视频就绪前的占位图，也是小屏（不播放视频）时的静态背景。 */
export const bgVideo = {
  src: `${import.meta.env.BASE_URL}bg.mp4`,
  fallbackSrc: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
  poster: `${import.meta.env.BASE_URL}bg-poster.jpg`,
  type: 'video/mp4',
}

/** ── 名言引用 ── */
export const quotes: { text: string; author: string }[] = [
  { text: '教育不是灌满一桶水，而是点燃一团火。', author: '苏格拉底' },
  { text: '教育的根是苦的，但其果实是甜的。', author: '亚里士多德' },
  { text: '教育的目的，是让人成为他自己。', author: '卡尔·罗杰斯' },
  { text: '真正的教育，是让自己成为不需要老师的人。', author: '佚名' },
  { text: '教育的艺术，在于唤醒和鼓舞。', author: '第斯多惠' },
  { text: '教育的本质意味着：一棵树摇动另一棵树，一朵云推动另一朵云，一个灵魂唤醒另一个灵魂。', author: '雅斯贝尔斯' },
]
