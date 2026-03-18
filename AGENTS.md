# Project Overview

A Next.js 14 TypeScript frontend for the Codeset platform. Provides a marketing site + authenticated dashboard for users to manage API keys, view billing/credits, explore datasets/samples, and read blog posts. Uses Tailwind CSS and a small design-system built on Radix UI primitives. Auth uses GitHub OAuth with a backend API (JWT tokens).

Primary language/ecosystem: TypeScript / Next.js (App Router) / Tailwind / React.

Intended usage: run locally for development (npm run dev), build for production (npm run build) and deploy (CI workflow included for GitHub Pages).

# Key Components

- app/layout.tsx:RootLayout — global HTML/Head, font injection, AuthProvider, Toaster, GA script injection.
- contexts/AuthContext.tsx:AuthProvider, useAuth — client-side auth state, login/logout, refreshUser.
- lib/auth.ts:AuthService — network/token helpers used by AuthContext.
- lib/api.ts:ApiService — client API methods used by dashboard/datasets.
- lib/blog.ts:getAllPosts, getPostBySlug — static blog loader (reads markdown).
- app/page.tsx:Home — public landing hero + SDK quickstart example (client component).
- app/blog/page.tsx:BlogPage — server component listing posts via getAllPosts().
- app/blog/[slug]/page.tsx — per-post page; consumes components/BlogContent.tsx.
- components/BlogContent.tsx:BlogContent, processContent — render HTML/markdown content and convert <pre><code> blocks to SyntaxHighlighter.
- app/dashboard/layout.tsx:DashboardLayout — client-side layout with auth gating and redirect behavior.
- app/dashboard/page.tsx:Dashboard — client component that reads user (useAuth) and fetches credits from ApiService.
- app/datasets/page.tsx:DatasetsPage — client component: dataset list, samples pagination, search debounce, SampleDetailsModal integration.
- components/SampleDetailsModal.tsx:SampleDetailsModal — modal rendering sample metadata, diffs, and code highlighting.
- components/ui/* — design system primitives (Button, Dialog, Accordion, etc.), wrappers around Radix UI and other libs.
- components/GoogleAnalytics.tsx:GoogleAnalytics, pageview, event — client-side GA helpers used by app/layout.tsx.

# Architecture

    Browser (Next client)
          │
          ▼
    Next.js App Router (app/)
    ├─ RootLayout (app/layout.tsx) — AuthProvider, GA script, Toaster
    ├─ Public pages (app/page.tsx, app/blog, app/team, app/contact)
    └─ Protected subtree (/dashboard)
         └─ DashboardLayout (client): reads useAuth -> redirects if unauth
               └─ Dashboard pages (api-keys, credits, usage)
    Data providers:
    - lib/auth.ts (auth endpoints)
    - lib/api.ts (datasets, credits, samples)
    - lib/blog.ts (md -> html posts)
    UI primitives: components/ui/* (Radix wrappers, styling)

# Core Data Structures

- contexts/AuthContext.tsx: User (shape consumed by Dashboard pages; fields: api_keys, created_at, last_login_at).
  - AuthContext value: { user, loading, login, logout, refreshUser }.

- lib/api.ts: ApiService responses:
  - getUserCredits -> { balance (cents), ... }
  - getDatasets -> list of Dataset
  - getSamples -> { samples: Sample[], total_count }

- lib/blog.ts: Post { slug, title, date, excerpt, html/content } used by:
  - app/blog/page.tsx and app/blog/[slug]/page.tsx

- components/SampleDetailsModal.tsx: Sample shape with fields used: sample_id, language, repo, base_commit, version, created_at, verifier, latest, test groups (fail_to_pass, pass_to_pass, fail_to_fail), patch, non_code_patch, hints_text.

# Control Flow

Auth flow (typical):
1. User clicks Sign In -> Header uses useAuth().login() -> AuthService returns GitHub OAuth URL -> browser redirected to GitHub.
2. GitHub redirects to /auth/callback?code=...
3. app/auth/callback/page.tsx handles callback, exchanges code via backend, then calls useAuth().refreshUser() and redirects to /dashboard.

Blog rendering:
- app/blog/page.tsx calls lib/blog:getAllPosts() on the server to generate the list page.
- app/blog/[slug]/page.tsx uses post HTML and passes to components/BlogContent.tsx which transforms code blocks into SyntaxHighlighter (client component).

Dashboard data:
- app/dashboard/layout.tsx enforces auth on client. app/dashboard/page.tsx (client) uses useAuth().user and ApiService.getUserCredits to show credits, sets up visibilitychange listeners to refresh credits after external flows.

Datasets & samples:
- app/datasets/page.tsx fetches datasets on mount and samples when selectedDataset / currentPage / pageSize / debouncedSearch change. Opens SampleDetailsModal for sample inspection.

# Test-Driven Development

- There are few unit tests in the repo snapshot. Prefer manual verification for UI changes (npm run dev) and create unit/integration tests where appropriate.
- When adding tests:
  - Run test suite with your project's test runner (no test script in package.json — add jest/vitest per project convention).
  - Verify new components with React Testing Library and mock ApiService/AuthService.

# Bash Commands

- Start dev server: npm run dev
- Build production: npm run build
- Start production server: npm run start
- Lint: npm run lint
- CI (GitHub Actions): .github/workflows/nextjs.yml builds with Node 22.20 (`npx next build`) and uploads `./out` for Pages deployment.

# Code Style & Conventions

- TypeScript + React using the Next.js App Router.
- UI styling: Tailwind CSS with design tokens (bg-card, text-muted-foreground, etc.).
- UI primitives wrap Radix components (components/ui/*). Keep wrappers small and preserve forwardRef.
- Client/server boundary: explicitly mark client components with "use client" when using hooks, window, document, or other browser APIs.
- Use lib/utils.ts:cn for class merging and class-variance-authority (cva) for variants.

# Gotchas (high-priority)

- Client vs Server
  - Many components must remain client components (Header, DashboardLayout, GoogleAnalytics, BlogContent, most components/ui/*). Do not remove "use client" from these files (see app/dashboard/layout.tsx and components/BlogContent.tsx).
  - app/layout.tsx is a server component; do not add "use client" there — instead ensure nested client components themselves declare "use client".

- Auth
  - useAuth() throws if used outside AuthProvider. Ensure components calling useAuth are client components and that AuthProvider wraps the app (app/layout.tsx does this).

- BlogContent / HTML rendering
  - components/BlogContent.tsx uses regex-based splitting and dangerouslySetInnerHTML. Do not pass untrusted HTML; sanitize server-side or improve parsing (DOMParser/parse5) if input may be untrusted.
  - Code block language is currently hardcoded to 'python' — add language extraction from class attributes if accurate highlighting is required.

- GA & Analytics
  - components/GoogleAnalytics.tsx expects the gtag script to be injected (app/layout.tsx). Ensure GA_TRACKING_ID is present; otherwise pageview/event are no-ops. The code must concatenate pathname + (qs ? `?${qs}` : '') to avoid missing '?'.

- Next/Image remote images
  - If adding external images, update next.config.mjs images.domains accordingly to avoid Next/Image errors.

- Concurrency/Timers in animations
  - components/ConveyorBeltAnimation.tsx: ensure intervals set inside timeouts are cleared in cleanup (store id in ref) to avoid leaks.

- Pagination & pageSize
  - app/datasets/page.tsx: ensure pageSize never becomes 0; handle totalPages computation defensively (Math.max(1, pageSize)).

# Pattern Examples

- contexts/AuthContext.tsx:AuthProvider — centralized auth state, refreshUser/login/logout. (Good example of delegating network to lib/auth and exposing simple actions).
- components/ui/dialog.tsx:DialogContent — composing Portal + Overlay + Content + Close button; keeps dialog structure consistent across app.
- components/BlogContent.tsx:processContent — showcases incremental enhancement of HTML content to replace code blocks with SyntaxHighlighter (but be wary of regex fragility).
- app/dashboard/layout.tsx:DashboardLayout — auth gating at layout level for route subtree (best practice for protecting many routes).

# Common Mistakes and Remedies

- Symptom: "useAuth must be used within an AuthProvider" error.
  - Fix: Ensure the consumer is a client component and that <AuthProvider> from contexts/AuthContext.tsx wraps it (app/layout.tsx should do that).

- Symptom: Analytics not recorded / window.gtag undefined.
  - Fix: Confirm app/layout.tsx injected gtag script with correct GA_TRACKING_ID and that components/GoogleAnalytics.tsx is mounted client-side. Ensure CI/prod env var NEXT_PUBLIC_API_BASE_URL / GA ID present.

- Symptom: Code blocks not highlighted properly or broken HTML.
  - Fix: components/BlogContent.tsx uses regex splitting; prefer using a proper HTML parser or ensure markdown pipeline emits predictable <pre><code class="language-..."> markup and pass language to SyntaxHighlighter.

- Symptom: Images 404 or next/image errors.
  - Fix: Add hostnames to next.config.mjs images.domains or put images into /public.

- Symptom: Timers leaking or items spawning after unmount.
  - Fix: components/ConveyorBeltAnimation.tsx — ensure setInterval ids are stored (ref) and cleared in useEffect cleanup. Avoid returning cleanup from inside setTimeout callback only.

# Invariants

- Keep "use client" in components that use hooks or browser APIs (Header, DashboardLayout, GoogleAnalytics, BlogContent, many ui/* wrappers).
- AuthProvider must be available on client so useAuth is valid.
- GA_TRACKING_ID used in both app/layout.tsx script injection and components/GoogleAnalytics.tsx must match.

# Anti-patterns (avoid)

- Parsing arbitrary HTML with regex (components/BlogContent.tsx) — use DOMParser/parse5 for robust parsing.
- Turning server components that use hooks/window into server components by removing "use client".
- Embedding real secrets (API keys) into UI strings (sdkCode in app/page.tsx).
- Passing unsanitized user-provided HTML into dangerouslySetInnerHTML without sanitization.

# CI / Deployment Notes

- GitHub Actions workflow: .github/workflows/nextjs.yml
  - Builds on push to main (node 22.20.0).
  - Runs npm install and npx next build with env vars:
    - NEXT_PUBLIC_GITHUB_CLIENT_ID
    - NEXT_PUBLIC_API_BASE_URL
  - Outputs static `./out` for GitHub Pages deployment (static_site_generator: next).

# Useful Files & Entry Points

- package.json: scripts: dev | build | start | lint
- README.md: local setup and GitHub OAuth steps
- .github/workflows/nextjs.yml: CI build and Pages deploy
- next.config.mjs: Next config (check image domains or basePath changes)
- lib/blog.ts: getAllPosts/getPostBySlug — update when changing blog post format
- lib/api.ts: central ApiService — changes to endpoints must be mirrored across UI pages

---

If you need to modify rendering, data fetching, or auth flows start at the specific construct listed above (e.g., app/blog/page.tsx:BlogPage, contexts/AuthContext.tsx:refreshUser, components/BlogContent.tsx:processContent, app/dashboard/layout.tsx:DashboardLayout) and follow the "Pitfalls" section to avoid common regressions.

# Verification Checklist

- Run the full test matrix locally or in CI
- Confirm failing test fails before fix, passes after
- Run linters and formatters

# Test Integrity

- NEVER modify existing tests to make your implementation pass
- If a test fails after your change, fix the implementation, not the test
- Only modify tests when explicitly asked to, or when the test itself is demonstrably incorrect

# Suggestions for Thorough Investigation

When working on a task, consider looking beyond the immediate file:
- Test files can reveal expected behavior and edge cases
- Config or constants files may define values the code depends on
- Files that are frequently changed together (coupled files) often share context

# Must-Follow Rules

1. Work in short cycles. In each cycle: choose the single highest-leverage next action, execute it, verify with the strongest available check (tests, typecheck, run, lint, or a minimal repro), then write a brief log entry of what changed + what you'll do next.
2. Prefer the smallest change that can be verified. Keep edits localized, avoid broad formatting churn, and structure work so every change is easy to revert.
3. If you're missing information (requirements, environment behavior, API contracts), do not assume. Instead: inspect code, read docs in-repo, run a targeted experiment, add temporary instrumentation, or create a minimal reproduction to learn the truth quickly.


# Index Files

I have provided an index file to help navigate this codebase:
- `.cursor/docs/general_index.md`

The file is organized by directory (## headers), with each file listed as:
`- \`filename\` - short description. Key: \`construct1\`, \`construct2\` [CATEGORY]`

You can grep for directory names, filenames, construct names, or categories (TEST, CLI, PUBLIC_API, GENERATED, SOURCE_CODE) to quickly find relevant files without reading the entire index.

**MANDATORY RULE — NO EXCEPTIONS:** Before you read, edit, or even reference any file, you MUST first run:
`python .cursor/docs/get_context.py <file_path>`

This is a hard requirement for EVERY file you touch. Do not skip this step. Do not assume you already know enough about a file. Do not batch it "for later." Run it immediately, before any other action on that file.

The command returns critical context you cannot infer on your own:
- Edit checklist with tests to run, constants to check, and related files
- Historical insights (past bugs, fixes, lessons learned)
- Key constructs defined in the file
- Tests that exercise this file
- Related files and semantic overview
- Common pitfalls and derived requirements

**Workflow (follow this exact order every time):**
1. Identify which file you need to work with.
2. Run `python .cursor/docs/get_context.py <file_path>` and read the output.
3. Only then proceed to read, edit, or reason about the file.

If you need to work with multiple files, run the command for each one before touching any of them.

**Violations:** If you read or edit a file without first running get_context.py on it, you are violating a project-level rule. Stop, run the command, and re-evaluate your changes with the new context.

