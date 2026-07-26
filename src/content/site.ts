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
  navCta: '开始探索',
}

/** ── 关于页 ── */
export const about = {
  title: '关于我',
  intro: '一名扎根一线的教育实践者。\n相信教育不是灌满一桶水，而是点燃一团火。',
  achievements: [
    { year: '2025', text: '广元市教师能力大赛一等奖' },
    { year: '2023/2026', text: '指导学生分获四川省职业技能大赛二等奖、三等奖' },
    { year: '累计', text: '指导学生获市级、县级奖励 20 余次' },
    { year: '荣誉', text: '优秀指导教师称号 · 教坛新秀称号' },
  ] as { year: string; text: string }[],
  continueBtn: '继续',
}

/** ── 联系页 ── */
export const contact = {
  title: '联系我',
  email: '846699191@qq.com',
  hint: '点击邮箱可直接发送',
}

/** ── 文章页（占位）─ */
export const articles = {
  title: '文章',
  placeholder: '内容待补充，敬请期待……',
  backBtn: '回到首页',
}

/** ── 社交链接 ── */
export const socialLinks = [
  { label: 'GitHub', href: '#' },
  { label: 'Email', href: 'mailto:846699191@qq.com' },
] as const

/** ── 视频背景 ── */
export const bgVideo = {
  src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
  type: 'video/mp4',
}
