# Changelog

## Unreleased

- Add a Claude Code plugin inside the skill folder with Codex-style goal tools: `mcp__light-loop__start`, `mcp__light-loop__status` and `mcp__light-loop__end`. While a loop is active, each turn's end continues the session with the fixed directive, so the loop starts without typing `/goal`. The loop stops when ended as complete or blocked, when the user interrupts a turn or runs `/light-loop-stop`, or after 100 turns. Without the plugin, Claude Code still uses `/goal`.
- Do not start working until the goal is active; agreeing on the goal file does not start it.
- In Claude Code without `ProposeGoal`, ask for one thing at a time and show only the `/goal` line. Start turn 1 only in the turn that `/goal` starts, and show the line again if the user replies without running it.

## 0.2.0 — 2026-10-10

- Support Claude Code's `/goal` as well as Codex's Goal. The main steps no longer name tools; agent-specific tips at the end say what to call at each step.
- Keep the goal text fixed and put completion criteria, principles, decisions and lessons in a goal file that the agent reads at the start of every turn. Steer the run by editing the file instead of rewriting the goal.
- Show the completion criteria and their evidence in each turn's report, so an evaluator that only reads the conversation can judge completion.
- Change completion criteria only with the user's agreement and log every change in the goal file.

## 0.1.5 — 2026-10-05

- Replace the large hero banner with a small original loop monogram and a centered README header.
- Restore the workflow diagram's warm background, teal colors and rounded cards.
- Check HTML image paths as well as Markdown links. Leave the skill's behavior unchanged.

## 0.1.4 — 2026-10-05

- Replace the illustrated hero with a plain SVG made from text, boxes and arrows.
- Match the workflow diagram to the same monochrome style with blue arrows.
- Leave the skill's behavior unchanged.

## 0.1.3 — 2026-10-05

- Shorten the README's feature explanations and example while retaining requirements and cost caveats.
- Collapse release-specific installation details and simplify the project footer.
- Leave the skill's behavior unchanged.

## 0.1.2 — 2026-10-05

- Organize the README around continued progress, workflow improvement and lightweight coordination.
- Replace reader-directed questions and comparison tables with plain explanations and one concrete example.
- Simplify navigation and project information without changing the skill's behavior.

## 0.1.1 — 2026-10-05

- Explain the benefits for first-time loop users and the lighter coordination model for experienced users.
- Add an original hero image, a workflow diagram and concrete examples of improving the approach between turns.
- Compare Light Loop with Codex Small Loop without claiming unmeasured cost or speed gains.
- Leave the distributable skill and Goal template unchanged.

## 0.1.0 — 2026-10-05

- Extract the self-contained Light Loop skill from Super Hook Girl.
- Preserve the focused-turn and workflow-improvement principles in the native Goal template.
- Add public, project-local installation, an MIT license and release checks.
