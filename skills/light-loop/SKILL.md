---
name: light-loop
description: Use when the user requests a Goal-based loop to make focused progress across turns and improve the approach through results. Uses Codex's native Goal feature.
license: MIT
---

# Light Loop

Achieve the user's goal while improving how you work toward it. Codex's native Goal feature (`/goal`) sustains the work across focused turns.

## Keep the Goal Useful

Use `get_goal` to check the current Goal and `create_goal` to register a new one. If Goal tools are unavailable, report the limitation rather than substituting a memo.

Start from the template below. Use `<goal>` freely for the goal and notes worth preserving. Revise this part as work evolves, keeping the agreed goal clear and carrying forward useful decisions and lessons. Keep the light-loop principles unchanged so they survive long runs.

```text
Goal: <goal>

Light-loop principles:
- Focus: Give each turn one coherent purpose, sized to the task, so it receives concentrated attention. End the turn when its results and the next approach are clear.
- Improve the workflow: Before ending each turn, use its results to decide how to work better in the next turn. Carry forward effective methods; consider changes where the workflow got in the way, including small fixes or efficiency gains related to the agreed goal. Preserve useful decisions and lessons in the Goal as needed; briefly hand off results and how to approach the next task.

Finish when the agreed goal is achieved.
```

Keep the Goal active between turns; call `update_goal` with `complete` when the completion condition is met.
