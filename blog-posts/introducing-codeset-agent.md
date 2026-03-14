---
title: "Introducing Codeset Agent"
date: "2026-02-21"
tldr: "Codeset Agent improved Claude Haiku 4.5's task resolution rate from 52% to 62%, Sonnet 4.5's from 56% to 65.3%, and Opus 4.5's from 60.7% to 68% on codeset-gym-python (150 tasks). Results hold on SWE-Bench Pro, where Sonnet 4.5 improved from 53% to 55.7% on 300 randomly sampled tasks."
---

Today we're launching **Codeset Agent**.

When you use a coding agent like Claude Code, every session starts with limited knowledge of your project's history. It doesn't know which files tend to break together, implicit decisions hidden in the code, which tests to run after touching a specific module. That knowledge exists in your project's history and your code's structure, but needs to be surfaced for the agent to use it.

Codeset Agent does that. You point it at a GitHub repository, and it generates a knowledge base that your favourite coding agent learns from:

## What your agent sees

Here's the key part. When your agent opens a file in a project configured by Codeset, this is what it sees before it writes a single line of code:

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

None of this is written by hand. Codeset extracts it from your git history and codebase structure during analysis.

## How it works

1. **Paste your GitHub URL** and connect your account.
2. **We analyze your repository.** The pipeline mines your commit history, runs static analysis across your codebase, maps test coverage, and traces function callers. This takes under an hour.
3. **Download and commit the files.** Your agent uses them on every subsequent session. $3 per repo, one-time.

## Evaluation

We evaluated how good Codeset Agent is at actually helping agents like Claude Code solve more tasks.

### The benchmarks

**codeset-gym-python** is our public dataset of software engineering tasks, similar to but harder than SWE-Bench. We randomly sampled a set of 150 of these tasks. Each task comes from an actual GitHub issue and has a test suite that verifies the solution. A task is "resolved" only when all required tests pass.

**SWE-Bench Pro** 

### What we tested

We ran six configurations: Claude Code with three models (Haiku 4.5, Sonnet 4.5, Opus 4.5), each with and without Codeset Agent context. The Codeset Agent context was generated once per sample, targeting the base commit before any work is performed.

CHART_RESULTS_PLACEHOLDER

### What the numbers mean

**codeset-gym-python (150 tasks)**

| Model | Baseline | With Codeset | Improvement |
|---|---|---|---|
| Claude Haiku 4.5 | 52% (78/150) | 62% (93/150) | +10pp |
| Claude Sonnet 4.5 | 56% (84/150) | 65.3% (98/150) | +9.3pp |
| Claude Opus 4.5 | 60.7% (91/150) | 68% (102/150) | +7.3pp |

The improvement is consistent across all three model tiers — Codeset Agent is not compensating for a weak model. It adds on top of whatever capability the model already brings.

**Structured context lets you drop a model tier without losing performance.** This holds at every level of the stack:

- Haiku with Codeset Agent (62%) outperformed raw Sonnet (56%) — at less than one-third the inference cost ($0.61 vs $1.66 per task).
- Sonnet with Codeset Agent (65.3%) outperformed raw Opus (60.7%) — the mid-tier model with context beats the most capable model without it.

For teams running Claude Code at scale, the implication is significant: you can run a cheaper model configured with Codeset and exceed the resolution rate of a more expensive model running blind.

### SWE-Bench Pro

To confirm the results generalize beyond our own dataset, we ran a second evaluation on SWE-Bench Pro. We randomly selected a subset of 300 tasks to reduce the cost of evaluation.

Claude Code with Sonnet went from resolving 159/300 tasks (53.0%) to 167/300 (55.7%) — a 2.7 percentage point improvement. These results confirm the benefit of enhancing coding agents with Codeset.
The results also showed a cost reduction: average cost per task dropped from $2.70 to $2.28.
This likely reflects the agent making fewer iterations in obtaining relevant context when it already obtains the most relevant information from Codeset's knowledge base.

Across both benchmarks and all three model tiers, the direction is consistent: structured codebase context improves agent performance, and the gains are large enough to shift which model tier makes economic sense.

---

Codeset Agent is available today. Paste your GitHub URL, connect your account, and supercharge your agents in under 30 minutes. **$3 per repo, one-time payment.**

[Analyze your repo →](https://codeset.ai)
