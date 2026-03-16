"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { parseRepo } from "@/lib/repo"

const FAQS = [
  {
    q: "How much does it cost?",
    a: "$3 per repo, one-time. No subscription, no monthly fees, no seat licenses. You pay once per analysis run and the files are yours — re-run any time as your codebase evolves.",
  },
  {
    q: "Which agents do you support?",
    a: "Claude Code, Cursor, and GitHub Copilot. Claude Code users receive a CLAUDE.md — Anthropic's standard format for agent instructions. Cursor and GitHub Copilot users receive an AGENTS.md. Additional agents are available on request.",
  },
  {
    q: "Does this work with private repositories?",
    a: "Yes. We use GitHub OAuth and request only the repository permissions needed to analyze your code. Your source code is never stored after analysis.",
  },
  {
    q: "What exactly do you generate?",
    a: "A CLAUDE.md / AGENTS.md entry point and a per-file knowledge base (files.json + retrieve_file_info.py). Your agent can query the knowledge base to get relevant insights, pitfalls, and caller information for any file.",
  },
  {
    q: "Is this just an automated AGENTS.md generator?",
    a: "No. AGENTS.md is the entry point, but the real depth is in the per-file knowledge base. We mine your commit history for past bugs and lessons learned, run AST analysis to trace every function caller across the codebase, extract file-specific pitfalls with root causes, and map which tests exercise which files. The per-file knowledge base is structured so your agent can query it on demand — not a static document it has to search through.",
  },
  {
    q: "How is the improvement measured?",
    a: "We validate on two benchmarks: codeset-gym-python (our own dataset of 150 real GitHub tasks) and SWE-Bench Pro (300 randomly sampled tasks from the industry-standard benchmark). We run coding tasks against agents before and after our configuration and measure the resolution rate.",
  },
  {
    q: "How long does it take?",
    a: "About 30 minutes. You connect to GitHub, select the repo, and wait for the files to get ready.",
  },
]

const MARQUEE_LOGOS = [
  { src: "/logos/claude.svg", alt: "Claude Code" },
  { src: "/logos/cursor.svg", alt: "Cursor" },
  { src: "/logos/github-copilot.svg", alt: "GitHub Copilot" },
  { src: "/logos/openai.svg", alt: "OpenAI Codex" },
  { src: "/logos/gemini.svg", alt: "Gemini CLI", className: "mb-0.5" },
]

const MARQUEE_COPIES = 4
const MARQUEE_DURATION_MS = 30000

function WorksWithLogos() {
  const stripRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [glowIndices, setGlowIndices] = useState<Set<number>>(new Set())
  const positionRef = useRef(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    let rafId = 0
    const tick = (time: number) => {
      const strip = stripRef.current
      const view = viewRef.current
      if (!strip || !view) {
        rafId = requestAnimationFrame(tick)
        return
      }
      const firstSegment = strip.firstElementChild as HTMLElement | null
      const secondSegment = firstSegment?.nextElementSibling as HTMLElement | null
      let segmentWidth: number
      if (firstSegment && secondSegment) {
        const r1 = firstSegment.getBoundingClientRect()
        const r2 = secondSegment.getBoundingClientRect()
        segmentWidth = r2.left - r1.left
      } else {
        segmentWidth = strip.offsetWidth / MARQUEE_COPIES
      }
      if (segmentWidth > 0) {
        const prevTime = lastTimeRef.current
        lastTimeRef.current = time
        if (prevTime > 0) {
          const delta = Math.min(time - prevTime, 100)
          positionRef.current += (segmentWidth / MARQUEE_DURATION_MS) * delta
          while (positionRef.current >= segmentWidth) {
            positionRef.current -= segmentWidth
          }
        }
        const x = positionRef.current - segmentWidth
        strip.style.transform = `translateX(${x}px)`
      }
      const viewRect = view.getBoundingClientRect()
      const centerX = viewRect.left + viewRect.width / 2
      const items = strip.querySelectorAll<HTMLElement>("[data-logo-index]")
      const next = new Set<number>()
      items.forEach((el) => {
        const idx = parseInt(el.getAttribute("data-logo-index") ?? "", 10)
        if (Number.isNaN(idx)) return
        const r = el.getBoundingClientRect()
        const center = r.left + r.width / 2
        if (center >= centerX) next.add(idx)
      })
      setGlowIndices((prev) => {
        if (prev.size !== next.size || [...prev].some((i) => !next.has(i))) return next
        return prev
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const baseClass = "h-5 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-200"
  const processedLogoClass = "!opacity-60 grayscale-0"
  const badgeGlowClass =
    "[filter:drop-shadow(0_0_4px_rgba(250,204,21,0.7))] [text-shadow:0_0_6px_rgba(250,204,21,0.5)]"

  return (
    <div className="w-full pt-4 pb-4 mt-4 border-t border-gray-100">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center pointer-events-none">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Your Repository</span>
          <div className="w-px h-4 bg-gray-200 mt-1" aria-hidden />
          <span className="text-[8px] text-gray-400 leading-none mt-0.5" aria-hidden>▼</span>
        </div>
        <div className="relative w-full min-h-[4rem] flex flex-col justify-center py-3">
          <div
            ref={viewRef}
            className="overflow-hidden absolute inset-0 flex flex-col justify-center"
          >
            <div ref={stripRef} className="flex items-center gap-6 sm:gap-10 w-max" style={{ willChange: "transform" }}>
              {[0, 1, 2, 3].map((copy) => (
                <div key={copy} className="flex items-center gap-6 sm:gap-10 shrink-0">
                  {MARQUEE_LOGOS.map((logo, i) => {
                    const index = copy * MARQUEE_LOGOS.length + i
                    const processed = glowIndices.has(index)
                    return (
                      <div
                        key={`${copy}-${i}`}
                        data-logo-index={index}
                        className="flex flex-col items-center gap-1 shrink-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className={`${baseClass} ${processed ? processedLogoClass : ""} ${logo.className ?? ""}`.trim()}
                        />
                        {processed && (
                          <span
                            className={`text-[9px] font-medium uppercase tracking-wider text-amber-600/90 whitespace-nowrap ${badgeGlowClass}`}
                          >
                            repo-aware
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div
            ref={boxRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none w-32 rounded border-2 border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-1 py-2"
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bacalhau.svg" alt="" className="h-6 w-auto" />
            <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
              &lt;codeset&gt; agent
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const HERO_LINE1 = "Your coding agent,"
const HERO_LINE2 = "but better."
const DELAY_SLOW_MS = 60
const DELAY_FAST_MS = 45

function TypewriterHero() {
  const [line1, setLine1] = useState("")
  const [line2, setLine2] = useState("")

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout> | null = null
    let t2: ReturnType<typeof setTimeout> | null = null

    let i = 0
    const runLine1 = () => {
      if (i < HERO_LINE1.length) {
        setLine1(HERO_LINE1.slice(0, i + 1))
        i++
        t1 = setTimeout(runLine1, DELAY_SLOW_MS)
      } else {
        i = 0
        t2 = setTimeout(runLine2, 120)
      }
    }
    const runLine2 = () => {
      if (i < HERO_LINE2.length) {
        setLine2(HERO_LINE2.slice(0, i + 1))
        i++
        t2 = setTimeout(runLine2, DELAY_FAST_MS)
      }
    }
    t1 = setTimeout(runLine1, 200)

    return () => {
      if (t1) clearTimeout(t1)
      if (t2) clearTimeout(t2)
    }
  }, [])

  return (
    <span className="relative block">
      <span className="invisible" aria-hidden="true">
        {HERO_LINE1}
        <br />
        {HERO_LINE2}
      </span>
      <span className="absolute top-0 left-0">
        {line1}
        <br />
        {line2}
      </span>
    </span>
  )
}

const WHAT_YOU_GET = [
  "CLAUDE.md / AGENTS.md",
  "Per-file knowledge base",
  "Commit history analysis",
  "Full AST caller graph",
  "Test-to-file mapping",
]

// Shown in "What you get" card 01
const SAMPLE_CLAUDE_MD = `# CLAUDE.md — acme/webapp

## Architecture
src/api/        # React Query hooks + axios clients
src/stores/     # Zustand — one store per domain
src/pages/      # Route-level components (flat)
src/components/ # Atomic design UI library

## Key Commands
pnpm test:unit  # Vitest + Testing Library
pnpm test:e2e   # Playwright
pnpm lint:fix   # ESLint + Prettier

## Conventions
- Functional components only
- Named exports preferred
- Mock src/api/* in every unit test

## Gotchas
Zustand uses the slice pattern.
See src/stores/README first.
Never call store actions during SSR.`

const HERO_AGENT_TASK = "Fix: session init crashes with null ptr when loading user in auth flow."

const HERO_AGENT_TOOL_OUTPUT = `$ python retrieve_file_info.py src/auth.ts

── src/auth.ts ───────────────── Deep Analysis

History:
  [Bug Fix] Null ptr on session init
  Root cause: timezone-naive date comparison
  Fix: always use datetime.timezone.utc

Pitfall:
  ✗ Don't call authenticate() before db.init()
  → RuntimeError: connection pool not created`

const HERO_AGENT_THINKING = `History: timezone-naive date comparison caused the null ptr; fix is to use datetime.timezone.utc. Pitfall: don't call authenticate() before db.init(). Session init currently runs before db — reorder so db.init() runs first, then use timezone.utc for created_at.`

const HERO_AGENT_FIX = `  def init_session():
+     db.init()
      user = authenticate()
-     created = datetime.now()
+     created = datetime.now(timezone.utc)`

const CHAT_STEP_DELAY_MS = 1200

function AgentChatHero() {
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    if (visibleCount >= 4) return
    const t = setTimeout(() => setVisibleCount((c) => c + 1), CHAT_STEP_DELAY_MS)
    return () => clearTimeout(t)
  }, [visibleCount])

  return (
    <div className="flex flex-col gap-4 max-w-lg">
      {visibleCount >= 1 && (
        <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <div className="rounded-2xl rounded-tl-sm bg-gray-900 text-gray-300 px-4 py-3 max-w-[85%] border border-gray-700">
            <p className="text-[12px] uppercase tracking-wider text-gray-500 mb-1">You</p>
            <p className="text-[12px] text-gray-300/95">{HERO_AGENT_TASK}</p>
          </div>
        </div>
      )}
      {visibleCount >= 2 && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <p className="text-[12px] uppercase tracking-wider text-amber-600/80 mb-1.5 font-medium">Tool powered by Codeset Agent · retrieve_file_info</p>
          <pre className="bg-gray-950 text-gray-300 text-[12px] leading-relaxed p-4 rounded-xl rounded-tl-none overflow-x-auto whitespace-pre border border-gray-800">
            {HERO_AGENT_TOOL_OUTPUT}
          </pre>
        </div>
      )}
      {visibleCount >= 3 && (
        <div className="flex justify-end animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <div className="rounded-2xl rounded-tr-sm bg-gray-900 text-gray-300 px-4 py-3 max-w-[90%] border border-gray-700">
            <p className="text-[12px] uppercase tracking-wider text-gray-500 mb-1">Agent</p>
            <p className="text-[12px] text-gray-300/95 italic">{HERO_AGENT_THINKING}</p>
          </div>
        </div>
      )}
      {visibleCount >= 4 && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <p className="text-[12px] uppercase tracking-wider text-emerald-600/80 mb-1.5 font-medium">Fix applied</p>
          <pre className="bg-gray-950 text-gray-300 text-[12px] leading-relaxed p-4 rounded-xl overflow-x-auto whitespace-pre border border-emerald-900/50 border-l-2 border-l-emerald-500/70">
            {HERO_AGENT_FIX}
          </pre>
        </div>
      )}
    </div>
  )
}

// "What you get" featured card 02
const FILE_INFO_CARD = `$ python retrieve_file_info.py src/payments.ts

── src/payments.ts ─────────────── Deep Analysis

History (4 insights):
  [Bug Fix] Double-charge on retry
    Root cause: idempotency key not persisted
    Fix: store key in DB before Stripe call
  [Breaking Change] Webhook signature v2
    Migration: update STRIPE_WEBHOOK_SECRET

Pitfalls:
  ✗ Don't call charge() inside a DB transaction
  → Stripe call may succeed but rollback fires
  ✗ Never log the full PaymentIntent object
  → Contains raw card data (PCI violation)

Callers (6 files):
  api/checkout.ts:88     handleCheckout()
  api/subscriptions.ts:41 renewSubscription()
  workers/retry.ts:15    retryFailedCharges()
  ... 3 more

Tests → tests/payments.test.ts:
  test_successful_charge, test_idempotent_retry,
  test_webhook_verification, test_refund_flow

Co-changes: src/webhooks.ts, src/subscriptions.ts`


function HeroForm({
  onSubmit,
  dark = false,
}: {
  onSubmit: (repo: string) => void
  dark?: boolean
}) {
  const [repoInput, setRepoInput] = useState("")
  const [error, setError] = useState("")

  const inputCls = dark
    ? "w-full border border-gray-600 bg-gray-900 text-white placeholder-gray-500 rounded-md px-4 py-3 text-sm font-mono focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
    : "w-full border border-gray-300 bg-white rounded-md px-4 py-3 text-sm font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black"

  const btnCls =
    "px-6 py-3 text-sm font-medium bg-amber-600/80 text-white rounded-md hover:bg-amber-600 transition-colors whitespace-nowrap flex-shrink-0"

  const handleSubmit = () => {
    const parsed = parseRepo(repoInput)
    if (!parsed.ok) {
      setError(parsed.error)
      return
    }
    setError("")
    onSubmit(parsed.repo)
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-3 w-full">
        <input
          type="text"
          value={repoInput}
          onChange={(e) => { setRepoInput(e.target.value); if (error) setError("") }}
          placeholder="your-org/your-repo or github.com/your-org/your-repo"
          className={`${inputCls}${error ? ' border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button onClick={handleSubmit} className={btnCls}>
          Customize my agents — $3 →
        </button>
      </div>
      {error && <p className={`text-xs ${dark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>}
    </div>
  )
}

function CodeWindow({
  title,
  content,
  className = "",
}: {
  title: string
  content: string
  className?: string
}) {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
        <span className="w-2.5 h-2.5 bg-red-400 rounded-full flex-shrink-0" />
        <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full flex-shrink-0" />
        <span className="w-2.5 h-2.5 bg-green-400 rounded-full flex-shrink-0" />
        <span className="ml-2 text-xs text-gray-400 font-mono truncate">{title}</span>
      </div>
      <pre className="bg-gray-950 text-gray-300 text-xs leading-relaxed p-5 overflow-x-auto whitespace-pre">
        {content}
      </pre>
    </div>
  )
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:text-black transition-colors"
      >
        <span>{q}</span>
        <ChevronDown
          size={15}
          className={`ml-4 flex-shrink-0 text-gray-400 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
      )}
    </div>
  )
}

export default function Home() {
  const { user, login } = useAuth()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleGetStarted = (repo: string) => {
    if (!repo) return
    sessionStorage.setItem(
      "codeset_pending_agent_job",
      JSON.stringify({ repo, trigger: true })
    )
    if (user) {
      router.push(`/dashboard/agent?repo=${encodeURIComponent(repo)}&trigger=true`)
    } else {
      login()
    }
  }


  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-mono">
      <Header />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="flex flex-col min-h-[calc(100vh-73px)] pt-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1fr] gap-10 md:gap-20 items-start">
          {/* Left */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mb-5 leading-[1.1]">
              <TypewriterHero />
            </h1>

            <div className="max-w-xl">
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Codeset Agent analyzes your entire repo — every commit,
                every function call, every test — and gives your agent the kind
                of codebase knowledge that usually takes months on a team to build.
              </p>

              <div className="mb-8 w-full">
                <WorksWithLogos />
              </div>
            </div>

            <HeroForm onSubmit={handleGetStarted} />

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-xs text-gray-500">
                <span className="text-gray-800 font-semibold">$3, one-time.</span>
                {" "}No subscription. Ready in ~30 minutes.
              </p>
              <a
                href="/blog/introducing-codeset-agent"
                className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                Read the evaluation →
              </a>
            </div>
          </div>

          {/* Right — agent chat: task → context → think → fix */}
          <div className="mt-8 md:mt-0">
            <AgentChatHero />
            <p className="mt-3 text-xs text-gray-400 text-center">
              The code agent calls our tool for context, reasons from it, then applies the fix.
            </p>
          </div>
        </div>
      </section>

      {/* ── Problem / Positioning ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20">
          <div>
            <h2 className="text-2xl font-medium mb-5 leading-snug">
              Conventions and architecture are easy.<br />
              The harder knowledge is implicit.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Which files tend to break together. Which functions have been
              misused before. Which edge cases burned your team three months ago
              and are about to happen again.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              That knowledge lives in your git history, your test suite, and
              your AST — not in any README. We extract it automatically and
              surface it to your agent at the moment it matters.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium mb-5 text-gray-400 uppercase tracking-widest">
              What we extract
            </h3>
            <ul className="space-y-4">
              {[
                [
                  "Commit history insights",
                  "Past bugs, root causes, failed attempts, and lessons learned — structured and linked to the files they affected.",
                ],
                [
                  "Per-file pitfalls",
                  "Specific relevant mistakes each file has caused, the consequence, and the prevention. Extracted from your history, not invented.",
                ],
                [
                  "Test coverage map",
                  "Which test files and functions exercise each source file. Your agent knows exactly where to look after making a change.",
                ],
                [
                  "Co-change patterns",
                  "Files historically modified together, exposing hidden coupling that imports alone don't reveal.",
                ],
                [
                  "AST caller graph",
                  "For every function, we know every caller: file, line number, and call context. Your agent understands impact before touching a line.",
                ],

              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3 text-sm">
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">→</span>
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-800">{title}. </span>
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── What you get ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Title now includes the price — makes it feel like a value reveal */}
          <h2 className="text-2xl font-medium mb-2">What you get — for $3</h2>
          <p className="text-sm text-gray-500 mb-10 max-w-lg leading-relaxed">
            A per-file knowledge base your agent can query as it works, and improved CLAUDE.md/AGENTS.md files.
          </p>

          {/* Top row: single card */}
          <div className="mb-5">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="text-xs text-gray-400 mb-1">01</div>
                <h3 className="font-medium text-gray-900 text-sm">AGENTS.md <span className="text-gray-400 font-normal">/ CLAUDE.md</span></h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Improved AGENTS.md/CLAUDE.md providing a high-level overview of your codebase.
                </p>
              </div>
              <pre className="bg-gray-950 text-gray-400 text-xs p-4 leading-relaxed overflow-x-auto whitespace-pre">
                {SAMPLE_CLAUDE_MD}
              </pre>
            </div>
          </div>

          {/* Bottom: featured full-width card — the differentiator */}
          <div className="border border-gray-800 rounded-lg overflow-hidden bg-white">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs text-gray-400">02</span>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                  What makes this different
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Per-file knowledge base</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-md">
                For every file in your repo: past bugs with root causes, specific
                pitfalls with consequences, every function caller with line numbers,
                and which tests exercise it. Queryable by your agent on demand.
              </p>
            </div>
            <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-gray-800">
              <div className="px-5 py-4 bg-gray-950">
                <pre className="text-gray-300 text-xs leading-relaxed overflow-x-auto whitespace-pre">
                  {FILE_INFO_CARD}
                </pre>
              </div>
              <div className="px-5 py-4 bg-gray-950 flex flex-col justify-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-2">
                    What your agent sees when it reads src/payments.ts
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {[
                      "The double-charge bug that hit production — and the fix.",
                      "Two pitfalls with consequences: don't call inside a transaction, never log the full object.",
                      "Six callers across the codebase, with file and line.",
                      "Four tests, ready to run after any change.",
                      "Two files that always move with this one.",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-gray-600 flex-shrink-0">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-800 pt-4">
                  Generated automatically from your git history and AST.
                  No manual annotation. No maintenance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-medium mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Connect your repo",
                desc: "Paste your GitHub URL and sign in. We support private and public repositories.",
              },
              {
                step: "02",
                title: "We analyze your codebase",
                desc: "Our pipeline mines your commit history, traces every function caller, extracts pitfalls, and maps test coverage. Under 30 minutes.",
              },
              {
                step: "03",
                title: "Download and commit",
                desc: "Get your AGENTS.md and per-file knowledge base. Commit them — your agent uses them from now on.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-xs font-medium text-gray-300 uppercase tracking-widest mb-3">{item.step}</div>
                <h3 className="font-medium mb-2 text-gray-900 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[2fr_3fr] gap-8 md:gap-20">
          <div>
            <h2 className="text-2xl font-medium mb-4">Common questions</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Anything not covered here — reach out via the{" "}
              <a href="/contact" className="underline hover:text-black transition-colors">
                contact page
              </a>
              .
            </p>
          </div>
          <div>
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-start">
          <div>
            <h2 className="text-3xl font-medium mb-3 leading-tight">
              Start with your most important repo.
            </h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md leading-relaxed">
              $3 per repo. One-time — no subscription, no seat licenses.
              Your agent gets wired into your codebase&apos;s history in under an hour.
            </p>
            <HeroForm onSubmit={handleGetStarted} dark />
          </div>
          <div className="border border-gray-800 rounded-lg p-6">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-4">
              What you get
            </h3>
            <ul className="space-y-3">
              {WHAT_YOU_GET.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="text-gray-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
