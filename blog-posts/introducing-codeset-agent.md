---
title: "Introducing Codeset Agent"
date: "2026-02-21"
excerpt: "Codeset Agent extracts deep knowledge from your GitHub repository — past bugs, caller graphs, test coverage — and surfaces it to Claude Code automatically. In a controlled evaluation, it improved task resolution rate by up to 10 percentage points."
---

Today we're launching **Codeset Agent**.

When you use an agent like Claude Code, it starts every session with no knowledge of your project's history. It doesn't know which files tend to break together, implicit decisions that have been made, or which tests to run after touching a specific module. That knowledge exists in your project's history and your code's structure, but nobody extracts it for the agent.

Codeset Agent does that extraction. You point it at a GitHub repository, and it produces three things:

1. An **AGENTS.md/CLAUDE.md** — a file that coding agents [read automatically at the start of every session](https://docs.anthropic.com/en/docs/claude-code/memory#claudemd-files). It contains your project's architecture, conventions, key commands, and known gotchas.

2. A **per-file knowledge base** — for every source file in your repo, a structured record of past bugs (with root causes), every function that calls into it (with file and line number), file-specific pitfalls, and which tests exercise it.

## What your agent sees

Here's the key part. When Claude Code opens a file in a Codeset Agent-configured repository, this is what it sees before it writes a single line of code:

```
$ python retrieve_file_info.py src/auth.py

── src/auth.py ─────────────────────── Deep Analysis

History (2 insights):
  [Bug Fix] Null ptr on session init
    Root cause: timezone-naive date comparison
    Fix: always use datetime.timezone.utc

Pitfall:
  ✗ Don't call authenticate() before db.init()
  → RuntimeError: connection pool not created

Callers (3 files):
  api/routes.py:42      login_handler()
  middleware/auth.py:18  verify_token()
  tests/setup.py:7      mock_auth_context()

Tests → tests/auth_test.py:
  test_valid_login
  test_expired_session
  test_concurrent_auth
```

Three things here that a generic agent doesn't have:

- **History**: a past bug in this file, with the root cause and how it was fixed. The agent won't reproduce the same mistake in a different form.
- **Callers**: every location in the codebase that calls into this file, with line numbers. The agent understands the impact of a change before making it.
- **Tests**: the exact tests to run after modifying this file. No guessing, no running the full suite.

None of this is written by hand. Codeset Agent extracts it from your git history and codebase structure during analysis.

## How it works

1. **Paste your GitHub URL** and connect your account.
2. **We analyze your repository.** The pipeline mines your commit history, runs static analysis across your codebase, maps test coverage, and traces function callers. This takes under an hour.
3. **Download and commit the files.** Your agent uses them on every subsequent session. $3 per repo, one-time.

## Evaluation

Before launching, we wanted to measure whether this context actually helps agents like Claude Code solve more tasks.

### The benchmark

**codeset-gym-python** is our public dataset of software engineering tasks, similar to but harder than SWE-Bench. We randomly sampled a set of 150 of these tasks. Each task comes from an actual GitHub issue and has a test suite that verifies the solution. A task is "resolved" only when all required tests pass.

### What we tested

We ran four configurations: Claude Code with two different models (Haiku 4.5 and Sonnet 4.5), each with and without Codeset Agent context. The Codeset Agent context was generated once per sample, targeting the base commit before any work is performed.

CHART_RESULTS_PLACEHOLDER

### What the numbers mean

Claude Code Haiku went from solving 78 tasks to 93 — a 10 percentage point improvement. Sonnet went from 84 to 95. Both improvements come purely from giving the agent structured codebase knowledge it wouldn't otherwise have.

Two additional findings worth calling out:

**Structured context can substitute for a larger model.** Haiku with Codeset Agent (62%, $0.57 per task) outperformed Sonnet without it (56%, $1.66 per task). A smaller, cheaper model with deep codebase knowledge beat a larger, more expensive model without it — at one-third the inference cost. For teams running Claude Code at scale, this changes the cost equation significantly.

**The agent uses fewer tokens, not more.** Adding context slightly *reduced* cost in both cases. Haiku went from $0.60 to $0.57 per task; Sonnet from $1.66 to $1.59. This makes sense: an agent that already knows what a file does and what's gone wrong in it before makes fewer exploratory reads and fewer incorrect edits before finding the right solution.

---

Codeset Agent is available today. Paste your GitHub URL, connect your account, and supercharge your agents in under 30 minutes. **$3 per repo, one-time payment.**

[Analyze your repo →](https://codeset.ai)
