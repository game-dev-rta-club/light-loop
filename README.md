# Light Loop

[![CI](https://github.com/game-dev-rta-club/light-loop/actions/workflows/ci.yml/badge.svg)](https://github.com/game-dev-rta-club/light-loop/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/game-dev-rta-club/light-loop)](https://github.com/game-dev-rta-club/light-loop/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![Light Loop: one agent learns as it works toward a goal along a lightweight loop.](assets/hero.png)

**Give Codex a goal. It keeps working—and improves its approach as it goes.**

Light Loop is a small Codex skill for tasks that need repeated improvement, such as fixing a stubborn bug, speeding up a feature, or polishing a UI. One agent works in repeated work cycles called **turns**, learns from each result, and adjusts how it tackles the next part.

## Make progress beyond a single reply

Loop engineering means repeating a cycle of work and feedback toward a goal. You describe the result you want; the agent works on part of the task, uses the result to choose its next action, and continues.

Light Loop uses Codex's native **Goal** feature to continue across turns. Each turn has one clear purpose. The Goal keeps the desired outcome and useful lessons together, and the agent marks it complete when the agreed outcome is achieved. You can follow the progress and steer it in the same conversation.

![One focused turn moves through focus, work and improving the approach. Results feed the next turn, while the Goal retains principles and useful lessons.](assets/loop.svg)

## Improve the approach each turn

Light Loop asks the agent to improve **how it works**, not just decide what to do next. Before ending a turn, it considers what helped or slowed the work and carries a better approach into the next turn.

For example, while polishing a UI, full-page screenshots may hide a small defect. The agent switches to close-ups so the next adjustment is easier to judge. It can also simplify repetitive setup that slows the task down.

The skill preserves these loop principles in the Goal so they remain available during long runs. It does not prescribe a fixed checklist or the same tests for every turn.

## Keep the loop lightweight

**One skill. One agent. No separate loop runner.**

Light Loop does not add a team of agents. You avoid spending extra tokens and time on briefing workers, passing tasks between them and coordinating their results. Codex handles continuation; the skill supplies the working principles.

Use it when one agent can own the task. For delegation and independent reviews, consider [Codex Small Loop](https://github.com/game-dev-rta-club/codex-small-loop). Parallel agents can be faster on independent work, so lower coordination overhead is not a guarantee of lower total cost or faster completion.

## Install and use

Run this from the project where you want to use Light Loop:

```sh
npx skills@latest add game-dev-rta-club/light-loop \
  --skill light-loop \
  --agent codex \
  --yes
```

Then give Codex a goal:

```text
$light-loop Investigate the slow search, fix the bottleneck, and get the existing
performance tests passing without changing the results users receive.
```

**Requires Codex with native Goal tools** (`get_goal`, `create_goal`, `update_goal`). Installing the skill does not add that feature. The installer needs Node.js, npm and Git; the skill itself is [one Markdown file](skills/light-loop/SKILL.md) with no runtime dependencies.

The installer places it in the project's `.agents/skills/`. Codex can use it after refreshing its skill list.

## Update

Rerun the installation command when you want to update. There are no background update checks. For a particular release, use its tag:

```sh
npx skills@latest add https://github.com/game-dev-rta-club/light-loop/tree/v0.1.2/skills/light-loop \
  --agent codex --yes
```

See the [release notes](CHANGELOG.md) for changes.

## Project

Maintained by [Game Dev RTA Club](https://github.com/game-dev-rta-club). [MIT](LICENSE) licensed.

Contributions are welcome. Keep the skill small and outcome-led; see [CONTRIBUTING.md](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md) and [security policy](SECURITY.md).
