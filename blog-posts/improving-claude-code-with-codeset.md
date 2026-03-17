---
title: "Improving Claude Code by 10pp with Codeset"
date: "2026-03-18"
tldr: "Codeset improved Claude Haiku 4.5's task resolution rate from 52% to 62%, Sonnet 4.5's from 56% to 65.3%, and Opus 4.5's from 60.7% to 68% on codeset-gym-python (150 tasks). Results hold on SWE-Bench Pro, where Sonnet 4.5 improved from 53% to 55.7% on 300 randomly sampled tasks."
---

Today we're launching **Codeset**.

When you use a coding agent like Claude Code, every session starts with limited knowledge of your project's history. It doesn't know which files tend to break together, implicit decisions hidden in the code, which tests to run after touching a specific module. That knowledge exists in your project's history and your code's structure, but needs to be surfaced for the agent to use it.

Codeset does that. You point it at a GitHub repository, and it generates a knowledge base that your favourite coding agent learns from:

## What your agent sees

Here's the key part. When your agent opens a file in a project configured by Codeset, this is what it sees before it writes a single line of code:

```
$ python .claude/docs/get_context.py src/auth.py

# src/auth.py

### Historical Insights
- [Bug Fix] Null ptr on session init
  Problem: Sessions failed silently on certain timezones.
  Root cause: timezone-naive date comparison
  Solution: always use datetime.timezone.utc

### Edit Checklist
Tests to run: `pytest tests/auth_test.py -q`
Data/constants: `SESSION_TIMEOUT: default session expiry value`

### Pitfalls
- Never call authenticate() before db.init()
  Consequence: RuntimeError: connection pool not created
  Prevention: Always initialize db before calling into auth.

### Key Constructs
- **verify_token** (function): Validates a session token and returns the associated user
  - api/routes.py:42      login_handler()
  - middleware/auth.py:18  verify_token()
  - tests/setup.py:7       mock_auth_context()

### Related Files
- `middleware/session.py` [co-change] | Check: If session token format changes, auth validation logic must be updated in sync.
```

Four things here that a generic agent doesn't have:

- **History**: past bugs in this file, with root causes and how they were fixed. The agent won't reproduce the same mistake in a different form.
- **Edit Checklist**: the exact tests to run and constants to check before touching this file. No guessing, no running the full suite.
- **Pitfalls**: what breaks and why, not just what to avoid. The agent knows the consequence before making a change.
- **Co-change relationships**: files that historically break together with this one — knowledge that exists nowhere in the code itself.

None of this is written by hand. Codeset extracts it from your git history and codebase structure during analysis.

## How it works

1. **Paste your GitHub URL** and connect your account.
2. **We analyze your repository.** The pipeline mines your commit history, runs static analysis across your codebase, maps test coverage, and traces function callers. This takes under an hour.
3. **Download and commit the files.** Your agent uses them on every subsequent session. $5 per repo, one-time.

## Evaluation

We evaluated how good Codeset is at actually helping agents like Claude Code solve more tasks.

### The benchmarks

**codeset-gym-python** is our public dataset of software engineering tasks, similar to but harder than SWE-Bench. We randomly sampled a set of 150 of these tasks. Each task comes from an actual GitHub issue and has a test suite that verifies the solution. A task is "resolved" only when all required tests pass.

**[SWE-Bench Pro](https://labs.scale.com/leaderboard/swe_bench_pro_public)** is a widely-used benchmark of real GitHub issues from open-source JS, TS, Go, and Python repositories.

### What we tested

We ran six configurations: Claude Code with three models (Haiku 4.5, Sonnet 4.5, Opus 4.5), each with and without Codeset context. The Codeset context was generated once per sample, targeting the base commit before any work is performed.

CHART_RESULTS_PLACEHOLDER

### What the numbers mean

**codeset-gym-python (150 tasks)**

| Model | Baseline | With Codeset | Improvement |
|---|---|---|---|
| Claude Haiku 4.5 | 52% (78/150) | 62% (93/150) | +10pp |
| Claude Sonnet 4.5 | 56% (84/150) | 65.3% (98/150) | +9.3pp |
| Claude Opus 4.5 | 60.7% (91/150) | 68% (102/150) | +7.3pp |

The improvement is consistent across all three model tiers — Codeset is not compensating for a weak model. It adds on top of whatever capability the model already brings.

**Structured context lets you drop a model tier without losing performance.** This holds at every level of the stack:

- Haiku with Codeset (62%) outperformed raw Sonnet (56%) — at less than one-third the inference cost ($0.61 vs $1.66 per task).
- Sonnet with Codeset (65.3%) outperformed raw Opus (60.7%) — the mid-tier model with context beats the most capable model without it.

For teams running Claude Code at scale, the implication is significant: you can run a cheaper model configured with Codeset and exceed the resolution rate of a more expensive model running blind.

### SWE-Bench Pro

To confirm the results generalize beyond our own dataset, we ran a second evaluation on SWE-Bench Pro. We randomly selected a subset of 300 tasks to reduce the cost of evaluation.

Claude Code with Sonnet went from resolving 159/300 tasks (53.0%) to 167/300 (55.7%) — **a 2.7 percentage point improvement**, on par with the delta observed between incremental releases within the GPT-5 model line (5.2 → 5.4) on the same benchmark ([2.1 percentage points](https://openai.com/index/introducing-gpt-5-4/)).
The results also showed a cost reduction: average cost per task dropped from $2.70 to $2.28 (**a 15.6% decrease**).
This likely reflects the agent making fewer iterations in obtaining relevant context when it already obtains the most relevant information from Codeset's knowledge base.

Across both benchmarks and all three model tiers, the direction is consistent: structured codebase context improves agent performance, and the gains are large enough to shift which model tier makes economic sense.

---

Codeset is available today. Paste your GitHub URL, connect your account, and supercharge your agents in under 30 minutes. **$5 per repo, one-time payment.**

[Analyze your repo →](https://codeset.ai)
