---
name: light-loop
description: Use when the user asks for a goal-based loop that keeps working toward an agreed goal across focused turns and improves the approach from each turn's results. Works with agents that can keep a goal active across turns, such as Codex and Claude Code.
license: MIT
---

# Light Loop

Achieve the user's goal while improving how you work toward it. A goal feature keeps the work going across focused turns: Codex's goal tools, or in Claude Code the Light Loop tools that ship with this skill. A goal file holds everything that should evolve during the run, so the goal itself never needs rewriting.

## 1. Agree on the goal

Settle these with the user before starting:

- The end state the user wants.
- Completion criteria. Make each one checkable from evidence you can show in your report, such as a command result or a file's content.
- Constraints that must hold on the way.

## 2. Write the goal file

Create one Markdown file for this run. Put it where it survives the whole run and the user can open it. Unless the user wants it kept with the project, choose a location that is not committed.

```markdown
# Goal: <one-line goal>

## Completion criteria
Change these only with the user's agreement, and log every change below.
- [ ] <criterion> — proof: <how to show it>

## Principles
- Focus: Give each turn one coherent purpose, sized to the task, so it receives concentrated attention. End the turn when its results and the next approach are clear.
- Improve the workflow: Before ending each turn, use its results to decide how to work better in the next turn. Carry forward effective methods; consider changes where the workflow got in the way, including small fixes or efficiency gains related to the agreed goal.

## Decisions and lessons
- <turn>: <what was decided or learned, and why>

## Criteria changes
- <turn>: <change> — agreed by the user
```

## 3. Start the goal

Start the goal with the goal feature, using this directive as the goal text:

```text
Light Loop. At the start of every turn, read <goal file> and follow its completion criteria and principles. At the end of every turn, record new decisions and lessons in it. The goal is complete when every completion criterion in <goal file> is met and the turn's report shows the evidence for each.
```

Do not change this directive later. To steer the work, edit the goal file. The agent re-reads the directive every turn, so the goal file is read every turn even in long runs.

Do not start working until the goal is active. Agreeing on the goal file does not start the goal.

If the goal feature is unavailable, report the limitation instead of imitating one.

## 4. Work each turn

1. Read the goal file.
2. Start the report with the current completion criteria and the status of each.
3. Work on one coherent purpose.
4. Before ending, decide how to work better in the next turn. Record decisions and lessons in the goal file, and hand off the results and the next approach briefly.

If the completion criteria seem wrong or out of reach, ask the user. Do not weaken them on your own.

## 5. Finish

The goal is achieved when the report shows evidence that every completion criterion is met.

If the same blocker repeats for three consecutive turns, report what remains and end the goal as blocked. Do not declare completion just because you are stopping.

## Goal feature by agent

| Step | Codex | Claude Code |
|---|---|---|
| Start | `create_goal` with the directive | `mcp__light-loop__start` with the directive as `objective` |
| Check | `get_goal` | `mcp__light-loop__status` |
| Complete | `update_goal` with `complete` | `mcp__light-loop__end` with `complete` and the evidence as `reason` |
| Blocked | `update_goal` with `blocked` | `mcp__light-loop__end` with `blocked` and the blocker as `reason` |

The user asked for a Light Loop, so start the goal without asking again, and start turn 1 in the same turn once the call returns. Neither agent can rewrite an active goal's text, which is why everything that changes lives in the goal file.

### Claude Code

- The Light Loop tools come from a plugin in this skill folder. It loads in a trusted project where the skill is installed under `.claude/skills/light-loop`, from the session after installing or updating it. If the tools are missing, tell the user to trust the project and open a new session; do not use `/goal` instead.
- While the loop is active, each turn's end continues the session with the directive. The loop also stops when the user interrupts a turn, runs `/light-loop-stop`, or after 100 turns. The status line shows the turn.
