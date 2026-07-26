import { useState } from 'react'
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
  type PageId,
} from '@/content/site'

/** ── Logo ── */
function Logo() {
  return (
    <span
      className="text-2xl md:text-3xl tracking-tight text-foreground select-none flex items-baseline gap-2"
      style={{ fontFamily: "'Instrument Serif', serif" }}
    >
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

/** ── Navbar ── */
function Navbar({ currentPage, onNavigate }: {
  currentPage: PageId
  onNavigate: (id: PageId) => void
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

      <button
        onClick={() => onNavigate(currentPage === 'home' ? 'about' : 'articles')}
        className="hidden md:inline-flex cursor-pointer liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform"
      >
        {currentPage === 'home' ? hero.navCta : '开始探索'}
      </button>

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

/** ── Heading parts renderer ── */
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

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[calc(100dvh-64px)]">
      {children}
    </section>
  )
}

/** ── Home ── */
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
      <div className="animate-fade-rise-delay-2 flex items-center gap-6 mt-14">
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

/** ── About ── */
function AboutPage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <PageShell>
      <div className="animate-fade-rise w-full max-w-2xl mx-auto text-left">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-1px] mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}>
          {about.title}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line mb-10">
          {about.intro}
        </p>
        <div className="space-y-6">
          {about.achievements.map((item, i) => (
            <div key={i} className="flex items-start gap-4 animate-fade-rise-delay"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <span className="shrink-0 inline-flex items-center px-3 py-1 text-xs rounded-full liquid-glass text-muted-foreground">
                {item.year}
              </span>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
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

/** ── Contact ── */
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

/** ── Articles ── */
function ArticlesPage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <PageShell>
      <div className="animate-fade-rise text-center">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-1px] mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}>
          {articles.title}
        </h1>
        <p className="text-muted-foreground text-base">{articles.placeholder}</p>
        <button onClick={() => onNavigate('home')}
          className="animate-fade-rise-delay cursor-pointer liquid-glass rounded-full px-10 py-4 text-base text-foreground mt-10 hover:scale-[1.03] transition-transform">
          {articles.backBtn}
        </button>
      </div>
    </PageShell>
  )
}

const pages: Record<PageId, (props: { onNavigate: (id: PageId) => void }) => React.ReactNode> = {
  home: (props) => <HomePage {...props} />,
  about: (props) => <AboutPage {...props} />,
  contact: () => <ContactPage />,
  articles: (props) => <ArticlesPage {...props} />,
}

function App() {
  const [page, setPage] = useState<PageId>('home')
  return (
    <div className="relative min-h-screen overflow-hidden">
      <video autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0">
        <source src={bgVideo.src} type={bgVideo.type} />
      </video>
      <Navbar currentPage={page} onNavigate={setPage} />
      {pages[page]({ onNavigate: setPage })}
    </div>
  )
}

export default App
