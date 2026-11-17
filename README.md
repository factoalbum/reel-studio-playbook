# Reel Studio Playbook

How Internet Toolbox makes its short vertical reels, packed so any AI coding agent (Claude Code, Codex,
GitHub Copilot, Cursor, Gemini) can make reels the same way.

## Use it with an AI agent

1. Clone the repo and open it in your agent.
2. Say: "Read AGENTS.md, then write a reel script about <topic>." Record the voice yourself.
3. Give the agent the WAV and say: "Build the reel with skills/reel-build."
4. Ask for the caption with skills/reel-caption. Post it yourself.

## What is inside

| Path | What |
|---|---|
| `AGENTS.md` | The rules and the pipeline. Every agent reads this first. |
| `docs/` | Step-by-step workflow, brand look, scripts and hooks, captions, honesty rules, render gotchas |
| `skills/` | Agent skills: `reel-script`, `reel-build`, `reel-caption` |
| `studio/` | The real Remotion project with the brand kit (`src/brand`) and the code of every past reel |

## Requirements

Node.js 20+, about 2 GB free disk for Whisper and renders. Everything used is free; Claude Code itself needs a
paid Claude plan, other agents have their own plans.
