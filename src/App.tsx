import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  brand,
  navLinks,
  hero,
  about,
  contact,
  articles,
  socialLinks,
  bgVideo,
  quotes,
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
 * Logo
 * ════════════════════════════════════════════════════ */

function Logo() {
  return (
    <span
      className="text-2xl md:text-3xl tracking-tight text-foreground select-none flex items-center gap-2.5"
      style={{ fontFamily: "'Instrument Serif', serif" }}
    >
      <CELogo size={32} />
      {brand.nameCN}
      {brand.nameEN && (
        <span
          className="text-base md:text-lg text-muted-foreground font-normal"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
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
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <button
        onClick={() => onNavigate('home')}
        className="bg-transparent border-none cursor-pointer"
      >
        <Logo />
      </button>

      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((item) => (
          <button
            key={item.target}
            onClick={() => onNavigate(item.target)}
            className={cn(
              'bg-transparent border-none cursor-pointer text-sm transition-colors',
              currentPage === item.target
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          onClick={() => onNavigate(currentPage === 'home' ? 'about' : 'articles')}
          className="hidden md:inline-flex cursor-pointer liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform"
        >
          {currentPage === 'home' ? hero.navCta : '开始探索'}
        </button>
      </div>

      <button className="md:hidden text-foreground cursor-pointer bg-transparent border-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
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
      <div
        className="text-4xl sm:text-5xl md:text-6xl text-foreground font-normal"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
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
        fontFamily="Instrument Serif, serif"
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
    const timer = setInterval(() => {
      setPhase('exit')
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length)
        setPhase('enter')
      }, 400)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const q = quotes[index]

  return (
    <div className="max-w-3xl mx-auto text-center px-4">
      <div
        key={index}
        className={phase === 'enter' ? 'quote-enter' : 'quote-exit'}
      >
        <p
          className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-foreground italic"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
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
      <h1
        className="animate-fade-rise text-[clamp(1.8rem,6vw,5rem)] leading-[1.05] tracking-[-1.5px] max-w-5xl font-normal mx-auto"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
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
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "'Instrument Serif', serif" }}>
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
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-1px] mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}>
          {about.title}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-line mb-12">
          {about.intro}
        </p>

        {/* 数字计数器 */}
        <div className="grid grid-cols-3 gap-6 mb-16 max-w-lg">
          <Counter target={20} suffix="+" label="指导学生获奖" />
          <Counter target={2} suffix="项" label="省级以上荣誉" />
          <Counter target={2} suffix="项" label="个人称号" />
        </div>

        {/* 时间线标题 */}
        <h2 className="text-xl sm:text-2xl text-muted-foreground mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
          获奖经历
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
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-1px] mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}>
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
 * Articles Page
 * ════════════════════════════════════════════════════ */

function ArticlesPage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <PageShell>
      {/* 名言轮播 */}
      <div className="animate-fade-rise w-full mb-16">
        <QuoteCarousel />
      </div>

      <div className="animate-fade-rise-delay text-center">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-1px] mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}>
          {articles.title}
        </h1>
        <p className="text-muted-foreground text-base">{articles.placeholder}</p>
        <button onClick={() => onNavigate('home')}
          className="animate-fade-rise-delay-2 cursor-pointer liquid-glass rounded-full px-10 py-4 text-base text-foreground mt-10 hover:scale-[1.03] transition-transform">
          {articles.backBtn}
        </button>
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
  const [page, setPage] = useState<PageId>('home')
  const [theme, toggleTheme] = useTheme()

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0">
        <source src={bgVideo.src} type={bgVideo.type} />
      </video>
      <Navbar
        currentPage={page}
        onNavigate={setPage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {pages[page]({ onNavigate: setPage })}
    </div>
  )
}

export default App
