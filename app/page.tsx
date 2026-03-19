"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, CheckCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { ApiService, type PricingInfo } from "@/lib/api"
import { parseRepo } from "@/lib/repo"

const FAQS = [
  {
    q: "How much does it cost?",
    a: "$5 per repo, one-time. No subscription, no monthly fees, no seat licenses. You pay once per analysis run and the files are yours — re-run any time as your codebase evolves.",
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
    a: "A CLAUDE.md / AGENTS.md entry point and a per-file knowledge base (files.json + get_context.py). Your agent can query the knowledge base to get relevant insights, pitfalls, and caller information for any file.",
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
    a: "About 45 minutes for a medium-sized repo. Runtime scales with the size of the repo. You connect to GitHub, select the repo, and wait for the files to get ready.",
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
  const [enteringIndices, setEnteringIndices] = useState<Set<number>>(new Set())
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
      const entering = new Set<number>()
      const boxRect = boxRef.current?.getBoundingClientRect()
      const boxHalfWidth = (boxRect?.width ?? 128) / 2
      items.forEach((el) => {
        const idx = parseInt(el.getAttribute("data-logo-index") ?? "", 10)
        if (Number.isNaN(idx)) return
        const r = el.getBoundingClientRect()
        const center = r.left + r.width / 2
        if (center >= centerX) next.add(idx)
        else if (center > centerX - boxHalfWidth) entering.add(idx)
      })
      setGlowIndices((prev) => {
        if (prev.size !== next.size || [...prev].some((i) => !next.has(i))) return next
        return prev
      })
      setEnteringIndices((prev) => {
        if (prev.size !== entering.size || [...prev].some((i) => !entering.has(i))) return entering
        return prev
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const baseClass = "h-5 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-300"
  const enteringLogoClass = "!opacity-[15%] grayscale"
  const processedLogoClass = "!opacity-80 grayscale-0 [filter:drop-shadow(0_0_6px_rgba(99,102,241,0.3))]"
  const badgeGlowClass =
    "[filter:drop-shadow(0_0_4px_rgba(99,102,241,0.7))] [text-shadow:0_0_6px_rgba(99,102,241,0.5)]"

  return (
    <div className="w-full pt-2 pb-2 mt-2 border-t border-gray-100">
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
                          className={`${baseClass} ${processed ? processedLogoClass : enteringIndices.has(index) ? enteringLogoClass : ""} ${logo.className ?? ""}`.trim()}
                        />
                        {processed && (
                          <span
                            className={`text-[9px] font-medium uppercase tracking-wider text-[#6366F1] whitespace-nowrap ${badgeGlowClass}`}
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
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none w-32 rounded border-2 border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-1 py-2 ring-1 ring-indigo-400/30 animate-pulse"
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bacalhau.svg" alt="" className="h-6 w-auto" />
            <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
              &lt;codeset&gt;
            </span>
          </div>
        </div>
      </div>
    </div>
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

const SAMPLE_CLAUDE_MD_MOBILE = SAMPLE_CLAUDE_MD.split("\n")
  .map((line) => line.replace(/\s+#\s+.*$/, "").trimEnd())
  .join("\n")

const HERO_AGENT_TASK = "Fix: dashboard charts show flat lines for all metrics since last Tuesday."

const HERO_AGENT_TOOL_OUTPUT = `$ python get_context.py src/dashboard.py

# src/dashboard.py

### Description
Builds time-series chart data for the analytics dashboard
by aggregating rows from daily_stats.
...

### Related Files
- src/data_pipeline.py [co-change]
  Rel: Writes aggregated daily metrics consumed by dashboard queries
  Check: Migration #412 deprecated column event_count → events_total.
  Old column retained but no longer populated after migration.
...`

const HERO_AGENT_FIX = `  def get_chart_data(metric, date_range):
      return db.query(
-         "SELECT date, event_count "
+         "SELECT date, events_total "
          "FROM daily_stats "
          "WHERE date BETWEEN %s AND %s",
          date_range
      )`

const CHAT_STEP_DELAY_MS = 1200

function InlineTokens({ text, tokenCls }: { text: string; tokenCls: string }) {
  const parts: React.ReactNode[] = []
  const pattern = /(\S+\.(?:py|ts|js|tsx|jsx)\b|\b\w+\(\))/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      <code key={m.index} className={`${tokenCls} px-1 rounded font-mono text-[11px]`}>
        {m[0]}
      </code>
    )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

function DiffBlock({ content }: { content: string }) {
  return (
    <pre className="bg-slate-950 text-[12px] leading-relaxed p-3 rounded-lg overflow-x-auto border border-slate-800 font-mono">
      {content.split("\n").map((line, i) => {
        let cls = "text-slate-300"
        let bg = ""
        if (line.startsWith("+")) { cls = "text-emerald-400"; bg = "bg-emerald-500/20" }
        else if (line.startsWith("-")) { cls = "text-red-400"; bg = "bg-red-500/20" }
        return <span key={i} className={`block whitespace-pre ${cls} ${bg}`}>{line}</span>
      })}
    </pre>
  )
}

function AgentChatHero({ animate = true, onComplete }: { animate?: boolean; onComplete?: () => void }) {
  const [visibleCount, setVisibleCount] = useState(animate ? 1 : 4)
  const [iconPopped, setIconPopped] = useState(!animate)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!animate) {
      setVisibleCount(4)
      setIconPopped(true)
    }
  }, [animate])

  useEffect(() => {
    if (!animate || visibleCount >= 4) return
    const t = setTimeout(() => setVisibleCount((c) => c + 1), CHAT_STEP_DELAY_MS)
    return () => clearTimeout(t)
  }, [visibleCount, animate])

  useEffect(() => {
    if (!animate || visibleCount < 4) return
    const t = setTimeout(() => {
      setIconPopped(true)
      onCompleteRef.current?.()
    }, 300)
    return () => clearTimeout(t)
  }, [visibleCount, animate])

  const glowCls = "ring-2 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]"

  const stepCls = (step: number) =>
    visibleCount >= step
      ? "opacity-100 translate-y-0 transition-all duration-300"
      : "opacity-0 translate-y-2 pointer-events-none"

  return (
    <div className="flex flex-col gap-3 max-w-lg">

      {/* Task — styled as a GitHub issue */}
      <div className={stepCls(1)}>
        <div className="rounded-xl bg-white px-4 py-3 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-slate-400 font-mono">#847 · your-org/analytics</p>
            <span className="text-[10px] font-medium text-emerald-600 border border-emerald-200 rounded-full px-2 py-0.5">Open</span>
          </div>
          <p className="text-sm text-slate-800 font-medium">{HERO_AGENT_TASK}</p>
        </div>
      </div>

      {/* Context — Codeset's contribution, left-aligned */}
      <div className={stepCls(2)}>
        <div className={`rounded-xl border border-indigo-300 bg-indigo-50/50 p-3 transition-shadow ${visibleCount === 2 ? glowCls : ""}`}>
          <p className="text-xs mb-2">
            <span className="font-semibold text-indigo-600">Coding Agent</span>
            <span className="ml-2 uppercase tracking-widest text-slate-400">· Retrieves Codeset-extracted context</span>
          </p>
          <div className="bg-slate-950 text-xs leading-relaxed p-3 rounded-lg font-mono border border-slate-800">
            {HERO_AGENT_TOOL_OUTPUT.split("\n").map((line, i) => (
              <div key={i} className="whitespace-pre-wrap text-slate-300">
                <InlineTokens text={line} tokenCls="bg-slate-700/80 text-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analyzing — agent reasoning, subtly indented */}
      <div className={`ml-6 ${stepCls(3)}`}>
        <div className={`rounded-xl border border-slate-200 bg-slate-50 p-3 transition-shadow ${visibleCount === 3 ? glowCls : ""}`}>
          <p className="text-xs mb-2">
            <span className="font-semibold text-slate-700">Coding Agent</span>
            <span className="ml-2 uppercase tracking-widest text-slate-400">· Reasoning</span>
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            <InlineTokens
              text="Related file note shows migration #412 deprecated event_count — column still exists but is no longer written to. get_chart_data() still queries the old column, returning zeroes since the migration ran. Switching to events_total."
              tokenCls="bg-slate-100 text-slate-800"
            />
          </p>
        </div>
      </div>

      {/* Fix Applied — agent output, subtly indented */}
      <div className={`ml-6 ${stepCls(4)}`}>
        <div className={`rounded-xl border border-emerald-200 bg-emerald-50/30 p-3 transition-shadow ${glowCls}`}>
          <p className="text-xs mb-2">
            <span className="font-semibold text-emerald-700">Coding Agent</span>
            <span className="ml-2 uppercase tracking-widest text-emerald-500">· Fix Applied</span>
            <CheckCircle
              size={12}
              className={`inline-block ml-1.5 -mt-0.5 transition-colors duration-500 ${iconPopped ? "text-emerald-500" : "text-emerald-300"} ${iconPopped ? "animate-[pop_0.4s_ease-in-out]" : ""}`}
            />
          </p>
          <DiffBlock content={HERO_AGENT_FIX} />
        </div>
      </div>
    </div>
  )
}

// "What you get" featured card 02
const FILE_INFO_CARD = `$ python get_context.py src/payments.ts

── src/payments.ts ──

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


const HERO_HEADING = "Onboard your favorite \ncoding agent"

function TerminalHeading() {
  const [displayed, setDisplayed] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(HERO_HEADING.slice(0, i))
      if (i >= HERO_HEADING.length) {
        clearInterval(interval)
        setTimeout(() => setCursorVisible(false), 800)
      }
    }, 45)
    return () => clearInterval(interval)
  }, [])

  return (
    <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-5 leading-[1.1] min-h-[calc(2*1.1*1em)] sm:min-h-[calc(2*1.1*2.25rem)] md:min-h-[calc(2*1.1*3rem)]">
      {displayed.split("\n").map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
      {cursorVisible && (
        <span className="inline-block w-[2px] h-[0.85em] bg-current ml-0.5 align-middle animate-[blink_0.8s_step-end_infinite]" />
      )}
    </h1>
  )
}

function HeroForm({
  onSubmit,
  dark = false,
  priceLabel = "$5",
}: {
  onSubmit: (repo: string) => void
  dark?: boolean
  priceLabel?: string
}) {
  const [repoInput, setRepoInput] = useState("")
  const [error, setError] = useState("")

  const inputCls = dark
    ? "w-full border border-gray-600 bg-gray-900 text-white placeholder-gray-500 rounded-md px-4 py-3 text-sm font-mono focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
    : "w-full border border-gray-300 bg-white rounded-md px-4 py-3 text-sm font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black"

  const btnCls =
    "px-6 py-3 text-sm font-medium rounded-md text-white whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] bg-[#6366F1] shadow-[0_0_16px_rgba(99,102,241,0.15)] tracking-[-0.02em]"

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
          Onboard your agent — {priceLabel}
        </button>
      </div>
      {error && <p className={`text-xs ${dark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>}
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
  const [demoDone, setDemoDone] = useState(false)
  const [pricing, setPricing] = useState<PricingInfo | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    ApiService.getPricingInfo()
      .then(setPricing)
      .catch(() => setPricing(null))
  }, [])


  const priceLabel =
    pricing?.agent_job_cost_dollars != null
      ? `$${pricing.agent_job_cost_dollars}`
      : "$5"

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
      <section className="flex flex-col min-h-0 pt-16 sm:pt-20 pb-2 px-4 sm:px-6 lg:px-8 [@media(min-height:1000px)]:min-h-[calc(100vh-73px-4rem)] [@media(min-height:1000px)]:pt-44 [@media(min-height:1000px)]:pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-20 items-start">
          {/* Left */}
          <div>
            <TerminalHeading />

            <div>
              <div className="max-w-xl">
                <div className="text-sm text-gray-500 mb-6 leading-relaxed">
                  <p className="mb-2">Give Claude Code, Codex, and other agents the codebase knowledge your team spent years building.</p>
                  <ul className="hidden sm:block space-y-1 text-gray-600 list-none pl-0">
                    <li className="flex items-baseline gap-2">
                      <span className="text-indigo-400 font-medium text-xl leading-none shrink-0 w-4 text-center">•</span>
                      <span className="text-sm">Analyzes your commit history</span>
                    </li>
                    <li className="flex items-baseline gap-2">
                      <span className="text-indigo-400 font-medium text-xl leading-none shrink-0 w-4 text-center">•</span>
                      <span className="text-sm">Tracks every function call</span>
                    </li>
                    <li className="flex items-baseline gap-2">
                      <span className="text-indigo-400 font-medium text-xl leading-none shrink-0 w-4 text-center">•</span>
                      <span className="text-sm">Indexes all your tests</span>
                    </li>
                  </ul>
                  <p className="mt-3">
                  Codeset extracts the repository context your coding agents need to understand your codebase.
                  </p>
                </div>

                <div className="mb-3 w-full">
                  <WorksWithLogos />
                </div>
              </div>

              <HeroForm onSubmit={handleGetStarted} priceLabel={priceLabel} />

              <div className="mt-3">
                <p className="text-xs text-gray-500">
                  <span className="text-gray-800 font-semibold">{priceLabel} per repo, one-time.</span>
                  {" "}No subscription. Ready in ~45 minutes for a medium-sized repo.
                </p>
              </div>
              <div className="hidden sm:grid grid-cols-3 gap-2 sm:gap-3 mt-6 mb-2">
                <div className="border border-gray-200 rounded-lg px-3 sm:px-4 py-3">
                  <div className="text-base sm:text-xl font-medium tracking-tight leading-tight">52% → 62%</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Claude Haiku 4.5</div>
                </div>
                <div className="border border-gray-200 rounded-lg px-3 sm:px-4 py-3">
                  <div className="text-base sm:text-xl font-medium tracking-tight leading-tight">56% → 65.3%</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Claude Sonnet 4.5</div>
                </div>
                <div className="border border-gray-200 rounded-lg px-3 sm:px-4 py-3">
                  <div className="text-base sm:text-xl font-medium tracking-tight leading-tight">60.7% → 68%</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Claude Opus 4.5</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="hidden sm:inline">
                  With the information provided by Codeset, Haiku 4.5 delivers better performance than baseline Sonnet 4.5 and Opus 4.5, significantly reducing costs.{" "}
                </span>
                <br />
                <a
                  href="/blog/improving-claude-code-with-codeset"
                  className="text-gray-400 underline hover:text-gray-600 transition-colors"
                >
                  Read the full evaluation →
                </a>
              </p>
            </div>
          </div>

          {/* Right — agent chat: task → context → think → fix */}
          <div className="hidden md:block mt-8 md:mt-0">
            <AgentChatHero animate={!isMobile} onComplete={() => setDemoDone(true)} />
            <p className={`mt-3 text-xs text-gray-400 text-center max-w-lg transition-opacity duration-500 ${demoDone ? "opacity-100" : "opacity-0"}`}>
              The agent queries our knowledge base, reasons with it, and finds the correct fix.
            </p>
          </div>
        </div>
      </section>

      {/* ── Problem / Positioning ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
          <div>
            <h2 className="text-lg sm:text-2xl font-medium mb-5 leading-snug">
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
      <section className="py-16 bg-gray-50 border-t border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title now includes the price — makes it feel like a value reveal */}
          <h2 className="text-2xl font-medium mb-2">What you get — for {priceLabel}</h2>
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
                {isMobile ? SAMPLE_CLAUDE_MD_MOBILE : SAMPLE_CLAUDE_MD}
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
            <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-gray-800 min-w-0">
              <div className="px-5 py-4 bg-gray-950 min-w-0 overflow-hidden">
                <pre className="text-gray-300 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap md:whitespace-pre">
                  {FILE_INFO_CARD}
                </pre>
              </div>
              <div className="px-5 py-4 bg-gray-950 flex flex-col justify-center gap-4 min-w-0">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-2 break-words">
                    What your agent sees when it reads src/payments.ts
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400 min-w-0">
                    {[
                      "The double-charge bug that hit production — and the fix.",
                      "Two pitfalls with consequences: don't call inside a transaction, never log the full object.",
                      "Six callers across the codebase, with file and line.",
                      "Four tests, ready to run after any change.",
                      "Two files that always move with this one.",
                    ].map((item) => (
                        <li key={item} className="flex gap-2 min-w-0">
                          <span className="text-gray-600 flex-shrink-0">›</span>
                          <span className="min-w-0 break-words">{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-800 pt-4 min-w-0 break-words">
                  Extracted automatically from your git history and AST.
                  No manual annotation. No maintenance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-medium mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "Connect your repo",
                desc: "Paste your GitHub URL and sign in. We support private and public repositories.",
              },
              {
                step: "02",
                title: "We analyze your codebase",
                desc: "Our pipeline mines your commit history, traces every function caller, extracts pitfalls, and maps test coverage.",
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-20">
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
                a={i === 0 ? `${priceLabel} per repo, one-time. No subscription, no monthly fees, no seat licenses. You pay once per analysis run and the files are yours — re-run any time as your codebase evolves.` : faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-16 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-16 items-start">
          <div>
            <h2 className="text-3xl font-medium mb-3 leading-tight">
              Start with your most important repo.
            </h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md leading-relaxed">
              {priceLabel} per repo. One-time — no subscription, no seat licenses.
              Your agent gets wired into your codebase&apos;s history in under an hour.
            </p>
            <HeroForm onSubmit={handleGetStarted} dark priceLabel={priceLabel} />
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
