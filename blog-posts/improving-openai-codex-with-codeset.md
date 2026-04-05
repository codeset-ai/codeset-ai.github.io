---
title: "Improving OpenAI Codex with Repo-Specific Context"
date: "2026-04-06"
excerpt: "We ran our Codeset evaluation on OpenAI Codex running GPT-5.4. The improvement is consistent — and the structured context approach holds across AI families."
tldr: "Codeset improved GPT-5.4's task resolution rate from 60.7% to 66% (+5.3pp) on codeset-gym-python (150 tasks, same subset as our Claude eval). On SWE-Bench Pro (400 randomly sampled tasks), resolution rate improved from 56.5% to 58.5% (+2pp). The gain is model-agnostic."
---

Three weeks ago we published results showing Codeset improved Claude models by 7–10 percentage points on real coding tasks. That eval covered three tiers of the Anthropic model family. What it didn't answer was whether the gain was specific to how Claude processes context — or whether it was something more fundamental.

So we ran the same evaluation on OpenAI Codex running GPT-5.4.

## The setup

We used the same benchmarks and, crucially, the same task subset as the Claude eval.

**codeset-gym-python** is our public dataset of software engineering tasks. We used the same 150-task subset from the original evaluation — same tasks, same verifiers, same evaluation harness. Each task comes from a real GitHub issue and is verified by a test suite that confirms the solution.

**[SWE-Bench Pro](https://labs.scale.com/leaderboard/swe_bench_pro_public)** is the widely-used benchmark of real GitHub issues across JS, TS, Go, and Python repositories. We randomly sampled 400 tasks to keep evaluation costs tractable.

Codeset context was extracted once per sample, targeting the base commit before any work is performed. The agent sees it before writing the first line of code.

## Results

CHART_CODEX_PLACEHOLDER

## What the numbers mean

The improvement is real and consistent across both benchmarks — which matters because the two benchmarks test different things. codeset-gym-python tasks come from our own curated dataset, weighted toward harder bugs. SWE-Bench Pro is an independent benchmark across multiple languages and repository types. Seeing improvement on both, using the same Codeset context pipeline, rules out dataset-specific effects.

**The context gap is model-agnostic.** Claude models improved by 7–10pp. GPT-5.4 improved by 5.3pp on the same task set. The mechanism is the same in both cases: the agent enters the task with structured knowledge it would otherwise have to reconstruct from scratch — or miss entirely. Historical bug patterns, co-change relationships, known pitfalls, the exact tests to run. That knowledge exists in every codebase's git history. Codeset surfaces it. The model doesn't matter.

**The SWE-Bench Pro delta is in line with prior results.** When we published the Claude eval, we noted that a +2.7pp improvement on SWE-Bench Pro was comparable to what you'd get from an incremental GPT-5 model upgrade (5.2→5.4: +2.1pp on the same benchmark). The GPT-5.4 result here — +2.0pp — is consistent with that range. Codeset provides a context boost that competes with a model-tier increment, at a fraction of the cost.

**The gain is additive, not compensatory.** Codeset doesn't paper over a weak model. GPT-5.4 is OpenAI's current flagship on coding tasks. Adding structured context still improves it by 5.3pp. The same was true for Claude Opus 4.5 — the best model in that family — which improved by 7.3pp.

The full evaluation artifacts — task results, per-sample outputs, and raw scores — are available at [github.com/codeset-ai/codeset-release-evals](https://github.com/codeset-ai/codeset-release-evals).

---

Codeset is available today. Point it at your GitHub repository, and every session your agent runs — whether it's Claude Code, OpenAI Codex, or any other tool — starts with context your team built over years. **$5 per repo, one-time payment.**

Use code **CODESETLAUNCH** for a free repo analysis.

[Analyze your repo →](https://codeset.ai)
