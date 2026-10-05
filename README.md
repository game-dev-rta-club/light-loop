# Light Loop

[![CI](https://github.com/game-dev-rta-club/light-loop/actions/workflows/ci.yml/badge.svg)](https://github.com/game-dev-rta-club/light-loop/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/game-dev-rta-club/light-loop)](https://github.com/game-dev-rta-club/light-loop/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**One Goal. One agent. Better ways of working.**

Minimal loop engineering with Codex's native Goal feature. Break a goal into focused turns, learn from each turn, and improve how the next one is carried out.

## Why light?

- **One small skill.** No custom loop runner, orchestration service or runtime dependencies. Codex keeps the Goal going.
- **Focused progress.** Each turn has one coherent purpose, sized to the task rather than forced into tiny steps.
- **A better workflow each turn.** Keep effective methods; change what slowed the work down. Small fixes and efficiency gains can be part of reaching the goal.
- **Less coordination overhead.** No multi-agent controller or repeated worker contexts. The design keeps orchestration token use and latency low; actual cost and speed depend on the task and model.

Light Loop improves the way the work gets done, not just the checklist of what remains.

## How it works

```text
Goal → focused turn → results + a better approach → next turn
```

Before finishing a turn, the agent uses its results to decide how to approach the next one. Useful decisions and lessons belong in the Goal, alongside the loop principles, so the approach survives long runs.

The goal decides when the loop ends. There is no fixed turn count, mandatory test suite or prescribed sequence of implementation steps.

[Read the complete skill](skills/light-loop/SKILL.md).

## Install

Run this from the project where you want to use Light Loop:

```sh
npx skills@latest add game-dev-rta-club/light-loop \
  --skill light-loop \
  --agent codex \
  --yes
```

The installer uses Node.js, npm and Git. It installs the skill under the project's `.agents/skills/`; the skill itself is just Markdown and needs no CLI setup. It becomes available when Codex refreshes its skill list.

Requires a Codex environment with native Goal tools: `get_goal`, `create_goal` and `update_goal`. Installing this skill does not add the Goal feature. Environments without those tools are not supported.

## Use

Give the agent a goal with a recognizable finish:

```text
$light-loop Make search fast enough that the existing performance test passes,
without changing the results users receive.
```

The agent registers the Goal with the Light Loop principles, makes focused progress across turns, and improves its approach as results come in. It marks the Goal complete when the agreed outcome is achieved.

For example, an unhelpful experiment should change the next experiment—not trigger the same attempt again. A repeated setup chore may be worth simplifying before continuing.

## Update

Rerun the installation command when you want to update. There are no background update checks. For a particular release, use its tag:

```sh
npx skills@latest add https://github.com/game-dev-rta-club/light-loop/tree/v0.1.0/skills/light-loop \
  --agent codex --yes
```

See the [release notes](CHANGELOG.md) for changes.

## Contributing

Keep the skill small and outcome-led. Focused issues and pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md) and [security policy](SECURITY.md).

## Maintainers

[Game Dev RTA Club](https://github.com/game-dev-rta-club)

## License

[MIT](LICENSE) © 2026 Game Dev RTA Club.
