import { useState, useEffect, useRef, useCallback } from 'react'
import { marked } from 'marked'
import { cn } from '@/lib/utils'
import {
  brand,
  navLinks,
  hero,
  about,
  contact,
  articles,
  articlesBySlug,
  articleTree,
  socialLinks,
  bgVideo,
  quotes,
  pageMeta,
  type ArticleBranch,
  type PageId,
} from '@/content/site'

/* ════════════════════════════════════════════════════
 * Theme Context
 * ════════════════════════════════════════════════════ */

type Theme = 'dark' | 'light'

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem('theme') as Theme) || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return [theme, toggle]
}

/* ════════════════════════════════════════════════════
 * Scroll Reveal Hook (for timeline)
 * ════════════════════════════════════════════════════ */

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

/* ════════════════════════════════════════════════════
 * Hash Routing
 * 让每个页面都有可分享 / 可刷新的 URL，形如 #/about
 * ════════════════════════════════════════════════════ */

const PAGE_IDS: PageId[] = ['home', 'about', 'articles', 'contact']

interface Route {
  page: PageId
  article?: string
}

/** 解析 URL hash；非法值回落到首页，文章详情形如 #/articles/<slug> */
function readHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [head, sub] = raw.split('/')
  if (head === 'articles' && sub) {
    return articlesBySlug[sub] ? { page: 'articles', article: sub } : { page: 'articles' }
  }
  return { page: (PAGE_IDS as string[]).includes(head) ? (head as PageId) : 'home' }
}

function useHashRoute(): [PageId, string | undefined, (id: PageId, article?: string) => void] {
  const [route, setRoute] = useState<Route>(readHash)

  // 支持浏览器前进 / 后退
  useEffect(() => {
    const onHashChange = () => {
      setRoute(readHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((id: PageId, article?: string) => {
    setRoute({ page: id, article }) // 立即切换，不必等 hashchange 事件
    const target = '#/' + id + (article ? '/' + article : '')
    if (window.location.hash !== target) {
      window.location.hash = target // 写入历史：可分享、可后退
    }
    window.scrollTo({ top: 0 }) // 切页回到顶部
  }, [])

  return [route.page, route.article, navigate]
}

/* ════════════════════════════════════════════════════
 * Background Video
 * 小屏省流量、尊重"减少动效"偏好；加载失败或不支持时优雅退场
 * （底层是 body 的 --background 底色，不会出现黑屏）
 * ════════════════════════════════════════════════════ */

function BackgroundVideo() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(wide && !calm)
  }, [])

  if (!enabled) return null

  return (
    <video
      className="absolute inset-0 w-full h-full object-cover z-0"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={bgVideo.poster}
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setEnabled(false)}
    >
      <source src={bgVideo.src} type={bgVideo.type} />
      <source src={bgVideo.fallbackSrc} type={bgVideo.type} />
    </video>
  )
}

/* ════════════════════════════════════════════════════
 * Logo
 * ════════════════════════════════════════════════════ */

function Logo() {
  return (
    <span className="font-display text-2xl md:text-3xl tracking-tight text-foreground select-none flex items-center gap-2.5">
      <CELogo size={32} />
      {brand.nameCN}
      {brand.nameEN && (
        <span className="font-body text-base md:text-lg text-muted-foreground font-normal">
          {brand.nameEN}
        </span>
      )}
      {brand.suffix && (
        <sup className="text-[0.5em] align-super ml-0.5 font-sans">
          {brand.suffix}
        </sup>
      )}
    </span>
  )
}

/* ════════════════════════════════════════════════════
 * Theme Toggle Button
 * ════════════════════════════════════════════════════ */

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="cursor-pointer liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-foreground hover:scale-110 transition-transform"
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

/* ════════════════════════════════════════════════════
 * Navbar
 * ════════════════════════════════════════════════════ */

function Navbar({ currentPage, onNavigate, theme, onToggleTheme }: {
  currentPage: PageId
  onNavigate: (id: PageId) => void
  theme: Theme
  onToggleTheme: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  // 切页后收起菜单；Esc 关闭
  const go = useCallback((id: PageId) => {
    setMenuOpen(false)
    onNavigate(id)
  }, [onNavigate])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const nextCta = currentPage === 'home' ? 'about' : 'articles'

  return (
    <nav className="relative z-20 px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => go('home')}
          className="bg-transparent border-none cursor-pointer"
          aria-label="回到首页"
        >
          <Logo />
        </button>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => (
            <button
              key={item.target}
              onClick={() => go(item.target)}
              className={cn(
                'bg-transparent border-none cursor-pointer font-display text-sm transition-colors',
                currentPage === item.target
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={() => go(nextCta)}
            className="hidden md:inline-flex cursor-pointer liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform"
          >
            {currentPage === 'home' ? hero.navCta : hero.navCtaAlt}
          </button>
          {/* 移动端菜单开关 */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-foreground cursor-pointer"
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute left-0 right-0 top-full mt-2 mx-4 rounded-2xl liquid-glass overflow-hidden"
        >
          <div className="flex flex-col p-2">
            {navLinks.map((item) => (
              <button
                key={item.target}
                onClick={() => go(item.target)}
                className={cn(
                  'cursor-pointer rounded-xl px-4 py-3 text-left font-display text-base transition-colors',
                  currentPage === item.target
                    ? 'text-foreground nav-item-active'
                    : 'text-muted-foreground hover:text-foreground nav-item-idle'
                )}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => go(nextCta)}
              className="mt-1 cursor-pointer rounded-xl px-4 py-3 text-center font-display text-base text-foreground nav-item-idle"
            >
              {currentPage === 'home' ? hero.navCta : hero.navCtaAlt}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ════════════════════════════════════════════════════
 * Hero Heading
 * ════════════════════════════════════════════════════ */

function HeroHeading({ parts }: {
  parts: { text: string; highlight?: boolean }[]
}) {
  return (
    <>
      {parts.map((part, i) => {
        if (part.text === '') return i > 0 ? <br key={i} /> : null
        if (part.highlight) return <em key={i} className="not-italic text-muted-foreground">{part.text}</em>
        return <span key={i}>{part.text}</span>
      })}
    </>
  )
}

/* ════════════════════════════════════════════════════
 * Animated Counter (数字计数器)
 * ════════════════════════════════════════════════════ */

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let raf = 0
    const startTime = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])

  return count
}

function Counter({ target, suffix, label }: { target: number; suffix?: string; label: string }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  const count = useCountUp(target, 2000, visible)

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground font-normal">
        {count}{suffix}
      </div>
      <div className="text-sm sm:text-base text-muted-foreground mt-2">{label}</div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
 * CE Logo (字母组合徽标)
 * ════════════════════════════════════════════════════ */

function CELogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* 外圈 */}
      <circle
        cx="24" cy="24" r="22"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      {/* CE 字母 */}
      <text
        x="24" y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Instrument Serif, Songti SC, SimSun, serif"
        fontSize="20"
        fill="currentColor"
        fontStyle="italic"
      >
        CE
      </text>
    </svg>
  )
}

/* ════════════════════════════════════════════════════
 * Page Shell
 * ════════════════════════════════════════════════════ */

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[calc(100dvh-64px)]">
      {children}
    </section>
  )
}

/* ════════════════════════════════════════════════════
 * Quote Carousel
 * ════════════════════════════════════════════════════ */

function QuoteCarousel() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>
    const timer = setInterval(() => {
      setPhase('exit')
      swap = setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length)
        setPhase('enter')
      }, 400)
    }, 8000)
    return () => {
      clearInterval(timer)
      clearTimeout(swap)
    }
  }, [])

  const q = quotes[index]

  return (
    <div className="max-w-3xl mx-auto text-center px-4">
      <div
        key={index}
        className={phase === 'enter' ? 'quote-enter' : 'quote-exit'}
      >
        <p className="font-display text-xl sm:text-2xl md:text-3xl leading-relaxed text-foreground italic">
          "{q.text}"
        </p>
        <p className="text-base text-muted-foreground mt-4">— {q.author}</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
 * Home Page
 * ════════════════════════════════════════════════════ */

function HomePage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <PageShell>
      <h1 className="animate-fade-rise font-display text-[clamp(1.8rem,6vw,5rem)] leading-[1.05] tracking-[-1.5px] max-w-5xl font-normal mx-auto">
        <HeroHeading parts={hero.headingParts} />
      </h1>
      <p className="animate-fade-rise-delay text-muted-foreground text-sm sm:text-base max-w-xl mt-6 leading-relaxed whitespace-pre-line">
        {hero.subtitle}
      </p>
      <button
        onClick={() => onNavigate('about')}
        className="animate-fade-rise-delay-2 cursor-pointer liquid-glass rounded-full px-12 py-4 text-base text-foreground mt-10 hover:scale-[1.03] transition-transform"
      >
        {hero.heroCta}
      </button>

      {/* 社交链接 */}
      <div className="animate-fade-rise-delay-2 flex items-center gap-6 mt-12">
        {socialLinks.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            className="font-display text-sm text-muted-foreground hover:text-foreground transition-colors">
            {link.label}
          </a>
        ))}
      </div>
    </PageShell>
  )
}

/* ════════════════════════════════════════════════════
 * About Page — 交互式成就时间线
 * ════════════════════════════════════════════════════ */

function TimelineItem({ item, index }: {
  item: { year: string; text: string; icon: string }
  index: number
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={cn(
        'timeline-item relative flex items-center w-full',
        isLeft ? 'justify-start' : 'justify-end',
        visible && 'visible'
      )}
    >
      {/* 时间线圆点 */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <div className="timeline-dot w-4 h-4 rounded-full" />
      </div>

      {/* 卡片 */}
      <div className={cn(
        'w-[44%] rounded-2xl p-6 timeline-card',
        isLeft ? 'mr-auto pl-6' : 'ml-auto pr-6 text-right'
      )}>
        <div className={cn('flex items-center gap-3 mb-3', isLeft ? '' : 'flex-row-reverse')}>
          <span className="text-2xl">{item.icon}</span>
          <span className="text-sm text-foreground/70 font-semibold tracking-wide">{item.year}</span>
        </div>
        <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
          {item.text}
        </p>
      </div>
    </div>
  )
}

function AboutPage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <PageShell>
      <div className="animate-fade-rise w-full max-w-3xl mx-auto text-left">
        {/* 头像 + 标题 */}
        <div className="flex items-center gap-6 mb-8">
          <div className="avatar-ring shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}avatar.jpg`}
              alt="严其"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-1px]">
              {about.title}
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-line mb-12">
          {about.intro}
        </p>

        {/* 数字计数器 */}
        <div className="grid grid-cols-3 gap-6 mb-16 max-w-lg">
          <Counter target={20} suffix="+" label="指导学生获奖" />
          <Counter target={2} suffix="项" label="省级以上荣誉" />
          <Counter target={3} suffix="项" label="个人称号" />
        </div>

        {/* 时间线标题 */}
        <h2 className="font-display text-xl sm:text-2xl text-muted-foreground mb-8">
          {about.achievementsTitle}
        </h2>

        {/* 时间线 */}
        <div className="relative">
          {/* 中间竖线 */}
          <div className="timeline-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]" />

          <div className="space-y-12 pb-4">
            {about.achievements.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onNavigate('articles')}
        className="animate-fade-rise-delay-2 cursor-pointer liquid-glass rounded-full px-12 py-4 text-base text-foreground mt-14 hover:scale-[1.03] transition-transform"
      >
        {about.continueBtn}
      </button>
    </PageShell>
  )
}

/* ════════════════════════════════════════════════════
 * Contact Page
 * ════════════════════════════════════════════════════ */

function ContactPage() {
  return (
    <PageShell>
      <div className="animate-fade-rise text-center">
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-1px] mb-6">
          {contact.title}
        </h1>
        <p className="text-muted-foreground text-sm mb-4">{contact.hint}</p>
        <a href={`mailto:${contact.email}`}
          className="animate-fade-rise-delay inline-flex cursor-pointer liquid-glass rounded-full px-10 py-4 text-base text-foreground hover:scale-[1.03] transition-transform no-underline">
          {contact.email}
        </a>
      </div>
    </PageShell>
  )
}

/* ════════════════════════════════════════════════════
 * Articles Page — 成长树
 * ════════════════════════════════════════════════════ */

function LeafNode({ article, side, delay, onNavigate }: {
  article: ArticleBranch['articles'][number]
  side: 'left' | 'right'
  delay: number
  onNavigate: (id: PageId, article?: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        'tree-leaf-item relative flex items-center',
        side === 'left' ? 'justify-end pr-8' : 'justify-start pl-8 leaf-right',
        visible && 'visible'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* 叶子小圆点 */}
      <div className={cn(
        'absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full leaf-dot',
        side === 'left' ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
      )} />

      <div className={cn('flex flex-col w-full max-w-xs', side === 'left' ? 'items-end' : 'items-start')}>
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className={cn(
            'tree-leaf text-left cursor-pointer rounded-xl p-4 w-full',
            side === 'left' ? 'text-right' : 'text-left'
          )}
        >
          <div className={cn('flex items-center gap-2', side === 'left' ? 'justify-end' : 'justify-start')}>
            <span className="text-xs text-muted-foreground">{article.date}</span>
            <span className="text-xs text-foreground/40">·</span>
            <span className="text-sm font-medium text-foreground">{article.title}</span>
          </div>
          {expanded && (
            <p className={cn('text-sm text-muted-foreground mt-2 leading-relaxed quote-enter',
              side === 'left' ? 'text-right' : 'text-left')}>
              {article.summary}
            </p>
          )}
        </button>
        {/* 展开面板放在按钮外层，避免 button 嵌套 button */}
        {expanded && (
          <div className={cn('quote-enter mt-2 px-4 w-full', side === 'left' ? 'text-right' : 'text-left')}>
            <button
              onClick={() => onNavigate('articles', article.slug)}
              className="cursor-pointer bg-transparent border-0 p-0 text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {articles.readMore}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function TreeBranch({ branch, index, onNavigate }: {
  branch: ArticleBranch
  index: number
  onNavigate: (id: PageId, article?: string) => void
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  const side = index % 2 === 0 ? 'left' : 'right'

  return (
    <div
      ref={ref}
      className={cn(
        'tree-branch relative flex items-center w-full min-h-[60px]',
        side === 'left' ? 'justify-start' : 'justify-end',
        visible && 'visible'
      )}
    >
      {/* 分支横线 */}
      <div className={cn(
        'absolute top-1/2 -translate-y-1/2 h-[1.5px] branch-line',
        side === 'left' ? 'left-[50%] w-[8%]' : 'right-[50%] w-[8%]'
      )} />

      {/* 分支标签 */}
      <div className={cn(
        'tree-branch-label flex items-center gap-2 rounded-full px-5 py-2.5',
        side === 'left' ? 'ml-auto' : 'mr-auto'
      )}>
        <span className="text-lg">{branch.icon}</span>
        <span className="font-display text-base sm:text-lg font-medium">
          {branch.category}
        </span>
        <span className="text-xs text-muted-foreground ml-1">({branch.articles.length})</span>
      </div>

      {/* 叶子节点 */}
      <div className={cn(
        'absolute flex flex-col gap-3',
        side === 'left' ? 'right-[58%] items-end' : 'left-[58%] items-start'
      )}>
        {branch.articles.map((article, i) => (
          <LeafNode key={article.slug} article={article} side={side} delay={i * 100} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}

function ArticlesPage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <PageShell>
      {/* 名言轮播 */}
      <div className="animate-fade-rise w-full mb-16">
        <QuoteCarousel />
      </div>

      <div className="animate-fade-rise w-full max-w-4xl mx-auto">
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-1px] mb-4 text-center">
          {articles.title}
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-16">{articles.leafHint}</p>

        {/* 成长树 */}
        <div className="relative w-full">
          {/* 主干 */}
          <div className="tree-trunk absolute left-1/2 -translate-x-1/2 top-0 bottom-0" />

          {/* 树根装饰 */}
          <div className="tree-root absolute left-1/2 -translate-x-1/2 -bottom-2" />

          <div className="space-y-20 pb-8">
            {articleTree.map((branch, i) => (
              <TreeBranch key={branch.category} branch={branch} index={i} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button onClick={() => onNavigate('home')}
            className="animate-fade-rise-delay cursor-pointer liquid-glass rounded-full px-10 py-4 text-base text-foreground hover:scale-[1.03] transition-transform">
            {articles.backBtn}
          </button>
        </div>
      </div>
    </PageShell>
  )
}

/* ════════════════════════════════════════════════════
 * Article Page — 文章详情（#/articles/<slug>）
 * 正文来自 src/content/articles/*.md，由 marked 渲染。
 * 内容作者即站长本人（信任边界内），故不做 XSS 消毒。
 * ════════════════════════════════════════════════════ */

function ArticlePage({ slug, onNavigate }: { slug: string; onNavigate: (id: PageId) => void }) {
  const article = articlesBySlug[slug]

  return (
    <PageShell>
      <div className="animate-fade-rise w-full max-w-2xl mx-auto">
        {article ? (
          <article>
            <p className="text-center text-xs text-muted-foreground mb-4">
              {article.category} · {article.date}
            </p>
            <h1 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.15] tracking-[-1px] mb-10 text-center">
              {article.title}
            </h1>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: marked.parse(article.body) }}
            />
          </article>
        ) : (
          <p className="text-center text-muted-foreground mt-20">{articles.notFound}</p>
        )}

        <div className="text-center mt-16">
          <button
            onClick={() => onNavigate('articles')}
            className="cursor-pointer liquid-glass rounded-full px-10 py-4 text-base text-foreground hover:scale-[1.03] transition-transform">
            {articles.backToList}
          </button>
        </div>
      </div>
    </PageShell>
  )
}

/* ════════════════════════════════════════════════════
 * App
 * ════════════════════════════════════════════════════ */

const pages: Record<PageId, (props: { onNavigate: (id: PageId) => void }) => React.ReactNode> = {
  home: (props) => <HomePage {...props} />,
  about: (props) => <AboutPage {...props} />,
  contact: () => <ContactPage />,
  articles: (props) => <ArticlesPage {...props} />,
}

function App() {
  const [page, articleSlug, navigate] = useHashRoute()
  const [theme, toggleTheme] = useTheme()
  // 以 JSX 方式渲染当前页面（而非直接调用函数），保证组件边界与 hook 规则不被破坏
  const CurrentPage = pages[page]

  // 每页独立的 SEO 标题与描述；文章详情页用文章自己的标题与摘要
  useEffect(() => {
    const a = page === 'articles' && articleSlug ? articlesBySlug[articleSlug] : undefined
    document.title = a ? `${a.title} · 严其 Chee Eom` : pageMeta[page].title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', a ? a.summary : pageMeta[page].description)
  }, [page, articleSlug])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundVideo />
      <Navbar
        currentPage={page}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main>
        {page === 'articles' && articleSlug ? (
          <ArticlePage slug={articleSlug} onNavigate={navigate} />
        ) : (
          <CurrentPage onNavigate={navigate} />
        )}
      </main>
    </div>
  )
}

export default App
