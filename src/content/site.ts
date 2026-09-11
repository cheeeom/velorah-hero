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

/** ── 文章页 ─ */
export interface ArticleItem {
  title: string
  date: string
  summary: string
}

export interface ArticleBranch {
  category: string
  icon: string
  articles: ArticleItem[]
}

export const articleTree: ArticleBranch[] = [
  {
    category: '教育随笔',
    icon: '✍️',
    articles: [
      { title: '被标准答案驯化的土地上', date: '2026-07', summary: '当教育只剩下一种正确答案，我们失去了什么？' },
      { title: '课堂里的沉默者', date: '2026-05', summary: '那些从不举手的学生，往往想得最多。' },
    ],
  },
  {
    category: '教学实践',
    icon: '🌱',
    articles: [
      { title: '指导学生参赛的三个关键', date: '2026-03', summary: '从市级到省级，一路走来总结的方法论。' },
      { title: '项目式教学初探', date: '2025-12', summary: '把课堂还给学生，把学习还给生活。' },
    ],
  },
  {
    category: '读书笔记',
    icon: '📖',
    articles: [
      { title: '读《教育的使命》', date: '2026-06', summary: '雅斯贝尔斯的启示：教育是唤醒，不是塑造。' },
    ],
  },
  {
    category: '成长反思',
    icon: '🌿',
    articles: [
      { title: '从教坛新秀到优秀指导教师', date: '2026-01', summary: '三年成长路，不是头衔的叠加，而是视角的转变。' },
      { title: '比赛之外的教育的意义', date: '2025-09', summary: '获奖不是终点，让学生学会思考才是。' },
    ],
  },
]

export const articles = {
  title: '文章',
  leafHint: '每一篇文章，都是一片生长的叶子 🌱',
  placeholder: '内容待补充，敬请期待……',
  backBtn: '回到首页',
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
