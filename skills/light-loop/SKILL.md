---
name: light-loop
description: Use when the user asks for a goal-based loop that keeps working toward an agreed goal across focused turns and improves the approach from each turn's results. Works with agents that can keep a goal active across turns, such as Codex and Claude Code.
license: MIT
---

# Light Loop

Achieve the user's goal while improving how you work toward it. The agent's goal feature keeps the work going across focused turns. A goal file holds everything that should evolve during the run, so the goal itself never needs rewriting.

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

Register the goal with the agent's goal feature, using this directive as the goal text:

```text
Light Loop. At the start of every turn, read <goal file> and follow its completion criteria and principles. At the end of every turn, record new decisions and lessons in it. The goal is complete when every completion criterion in <goal file> is met and the turn's report shows the evidence for each.
```

Do not change this directive later. To steer the work, edit the goal file. The agent re-reads the directive every turn, so the goal file is read every turn even in long runs.

Do not start working until the goal is active. Agreeing on the goal file does not start the goal.

If the agent has no goal feature, report the limitation instead of imitating one.

## 4. Work each turn

1. Read the goal file.
2. Start the report with the current completion criteria and the status of each.
3. Work on one coherent purpose.
4. Before ending, decide how to work better in the next turn. Record decisions and lessons in the goal file, and hand off the results and the next approach briefly.

If the completion criteria seem wrong or out of reach, ask the user. Do not weaken them on your own.

## 5. Finish

The goal is achieved when the report shows evidence that every completion criterion is met.

If the same blocker repeats for several turns, report what remains and stop as the agent's goal feature allows. Do not declare completion just because you are stopping.

## Agent-specific tips

### Codex

- Start the goal: `create_goal` with the directive. The user can also run `/goal <directive>`. Check it with `get_goal`.
- Complete it: after checking every criterion, call `update_goal` with `complete`.
- Stop when blocked: after the same blocker recurs for three consecutive turns, call `update_goal` with `blocked`.
- Codex cannot rewrite an active goal's text, which is why everything that changes lives in the goal file.

### Claude Code

- Start the goal: propose the directive with `ProposeGoal`; the user approves it with one keypress. Without that tool, ask for one thing at a time: first agree on the goal file, then show only the `/goal <directive>` line and ask the user to run it.
- Running `/goal` starts turn 1 by itself, and the conversation then says a session-scoped Stop hook is now active. Start turn 1 only in that turn. If the user replies without running it, show the line again instead of starting work.
- Complete it: a separate evaluator reads the conversation after each turn and clears the goal when it is met. It cannot read files, so the report must show the criteria and their evidence. You cannot mark the goal complete or clear it yourself.
- Stop when blocked: the evaluator clears the goal when it judges it impossible. The user can run `/goal clear`.
- The user can run `/goal` to see turns, elapsed time, token spend and the evaluator's last reason.
