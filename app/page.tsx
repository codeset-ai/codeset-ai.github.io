"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { normalizeRepo } from "@/lib/repo"

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
    a: "A CLAUDE.md / AGENTS.md entry point, a per-file knowledge base (files.json + retrieve_file_info.py), and agent-specific hook configuration. When your agent reads a file, the hooks automatically surface the relevant insights, pitfalls, and caller information for that file.",
  },
  {
    q: "Is this just an automated AGENTS.md generator?",
    a: "No. AGENTS.md is the entry point, but the real depth is in the per-file knowledge base. We mine your commit history for past bugs and lessons learned, run AST analysis to trace every function caller across the codebase, extract file-specific pitfalls with root causes, and map which tests exercise which files. This gets surfaced to your agent automatically via hooks — not as a static document it has to search through.",
  },
  {
    q: "How is the improvement measured?",
    a: "We validate using SWE-Bench-Verified, the industry-standard benchmark for AI coding agents. We run a set of real coding tasks against coding agents before and after our configuration and measure the resolution rate.",
  },
  {
    q: "How long does it take?",
    a: "Under one hour from GitHub connection to downloadable config files.",
  },
]

const WHAT_YOU_GET = [
  "CLAUDE.md / AGENTS.md",
  "Per-file knowledge base",
  "Commit history analysis",
  "Full AST caller graph",
  "Test-to-file mapping",
  "Auto-configured agent hooks",
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

// Hero — the WOW artifact
const FILE_INFO_HERO = `$ python retrieve_file_info.py src/auth.ts

── src/auth.ts ───────────────── Deep Analysis

History:
  [Bug Fix] Null ptr on session init
  Root cause: timezone-naive date comparison
  Fix: always use datetime.timezone.utc

Pitfall:
  ✗ Don't call authenticate() before db.init()
  → RuntimeError: connection pool not created

Callers (3 files):
  api/routes.ts:42      loginHandler()
  middleware/auth.ts:18  verifyToken()
  tests/setup.ts:7      mockAuthContext()

Tests → tests/auth.test.ts:
  test_valid_login
  test_expired_session
  test_concurrent_auth`

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

// "What you get" card 03
const HOOKS_SNIPPET = `// .claude/settings.local.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Read",
        "hooks": [{
          "type": "command",
          "command":
            "python retrieve_file_info.py $FILE"
        }]
      }
    ]
  }
}`

function HeroForm({
  onSubmit,
  dark = false,
}: {
  onSubmit: (repo: string) => void
  dark?: boolean
}) {
  const [repoInput, setRepoInput] = useState("")

  const inputCls = dark
    ? "w-full border border-gray-600 bg-gray-900 text-white placeholder-gray-500 rounded-md px-4 py-3 text-sm font-mono focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
    : "w-full border border-gray-300 bg-white rounded-md px-4 py-3 text-sm font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black"

  const btnCls = dark
    ? "px-6 py-3 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0"
    : "px-6 py-3 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap flex-shrink-0"

  const handleSubmit = () => {
    const repo = normalizeRepo(repoInput)
    onSubmit(repo)
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <input
        type="text"
        value={repoInput}
        onChange={(e) => setRepoInput(e.target.value)}
        placeholder="github.com/your-org/your-repo"
        className={inputCls}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button onClick={handleSubmit} className={btnCls}>
        Customize my agents →
      </button>
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
      <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1fr] gap-10 md:gap-20 items-start">
          {/* Left */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mb-5 leading-[1.1]">
              Your coding agent,<br />
              but better.
            </h1>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Codeset Agent analyzes your entire repo — every commit,
              every function call, every test — and gives your agent the kind
              of codebase knowledge that usually takes months on a team to build.
            </p>

            {/* Proof — benchmark numbers */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
              <div className="border border-gray-200 rounded-lg px-3 sm:px-4 py-3">
                <div className="text-base sm:text-xl font-medium tracking-tight leading-tight">52% → 62%</div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Claude Haiku</div>
              </div>
              <div className="border border-gray-200 rounded-lg px-3 sm:px-4 py-3">
                <div className="text-base sm:text-xl font-medium tracking-tight leading-tight">56% → 63.3%</div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Claude Sonnet</div>
              </div>
              <div className="border border-gray-900 bg-gray-50 rounded-lg px-3 sm:px-4 py-3">
                <div className="text-base sm:text-xl font-medium tracking-tight leading-tight">⅓ cost</div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Haiku+Codeset vs Sonnet</div>
              </div>
            </div>

            <HeroForm onSubmit={handleGetStarted} />

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-xs text-gray-400">
                <span className="text-gray-700 font-medium">$3 per repo.</span>
                {" "}One-time. Under 30 minutes.
              </p>
              <a
                href="/blog/introducing-codeset-agent"
                className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                Read the evaluation →
              </a>
            </div>
          </div>

          {/* Right — the WOW artifact */}
          <div className="mt-8 md:mt-0">
            <CodeWindow
              title="retrieve_file_info.py src/auth.ts"
              content={FILE_INFO_HERO}
              className="shadow-2xl shadow-gray-200/60"
            />
            <p className="mt-3 text-xs text-gray-400 text-center">
              Surfaced automatically when your agent reads a file.
            </p>
          </div>
        </div>

        {/* Works with — absorbed into hero as a subtle footer */}
        <div className="max-w-7xl mx-auto mt-12 sm:mt-14 pt-6 border-t border-gray-100">
          <p className="text-[11px] text-gray-300 uppercase tracking-widest text-center mb-4">Works with</p>
          <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/claude.svg" alt="Claude Code" className="h-5 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-200" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/cursor.svg" alt="Cursor" className="h-5 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-200" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/github-copilot.svg" alt="GitHub Copilot" className="h-5 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-200" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/openai.svg" alt="OpenAI Codex" className="h-5 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-200" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/gemini.svg" alt="Gemini CLI" className="h-5 mb-0.5 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-200" />
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
            A knowledge base your agent consults automatically as it works, automatically integrated into your agent, and improved CLAUDE.md/AGENTS.md files.
          </p>

          {/* Top row: two compact cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
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

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="text-xs text-gray-400 mb-1">03</div>
                <h3 className="font-medium text-gray-900 text-sm">Auto-configured hooks</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  When your agent reads a file, hooks inject the relevant
                  insights automatically — no manual lookup, no context lost.
                </p>
              </div>
              <pre className="bg-gray-950 text-gray-400 text-xs p-4 leading-relaxed overflow-x-auto whitespace-pre">
                {HOOKS_SNIPPET}
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
                and which tests exercise it. Retrieved by your agent via hooks the
                moment it reads the file.
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
                desc: "Get your AGENTS.md, per-file knowledge base, and auto-configured hooks. Commit them — your agent uses them from now on.",
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
