import type { EngineInterface, Register } from 'claude-code'

import type { Loop } from '../types'

// Light Loop's own goal for Claude Code, shaped like Codex's goal tools:
// the agent starts the loop, reads it, and ends it as complete or blocked.
// While the loop is active, every stop becomes the next turn.

const LOOP = { plugin: 'light-loop', key: 'loop' } as const
const MAX_TURNS = 100
const STOP_COMMAND = 'light-loop-stop'

export function continuation(loop: Loop): string {
  return [
    `Light Loop turn ${loop.turn}. Continue toward the goal:`,
    loop.objective,
    '',
    'When the report shows evidence that every completion criterion is met, call mcp__light-loop__end with status "complete".',
    'When the same blocker has stopped progress for three consecutive turns, call it with status "blocked".',
  ].join('\n')
}

export function describe(loop: Loop | null): string {
  if (!loop) return 'No Light Loop has been started in this session.'
  const ended = loop.status === 'active' ? '' : ` Ended: ${loop.reason ?? 'no reason given'}.`
  return `Light Loop is ${loop.status} at turn ${loop.turn}.${ended}\nObjective:\n${loop.objective}`
}

async function read($: EngineInterface): Promise<Loop | null> {
  return (await $.state.get(LOOP)).value ?? null
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.tool.register({
      name: 'start',
      description: 'Start a Light Loop: the objective stays fixed, and each time a turn ends the session continues with it until the loop is ended. Call it once the goal file is agreed, with the Light Loop directive as the objective. Refused while a loop is active.',
      inputSchema: {
        type: 'object',
        properties: { objective: { type: 'string', description: 'The fixed Light Loop directive.' } },
        required: ['objective'],
      },
      isDeferred: false,
    })
    await $.tool.register({
      name: 'status',
      description: 'Read the Light Loop: its objective, status (active, complete, blocked, stopped) and current turn.',
      isDeferred: false,
    })
    await $.tool.register({
      name: 'end',
      description: 'End the active Light Loop. "complete" only after the report shows evidence for every completion criterion; "blocked" when the same blocker has stopped progress for three consecutive turns. The objective itself cannot be changed; steer through the goal file.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['complete', 'blocked'] },
          reason: { type: 'string', description: 'The evidence, or what blocks progress.' },
        },
        required: ['status', 'reason'],
      },
      isDeferred: false,
    })
    await $.command.register({ name: STOP_COMMAND, description: 'Stop the active Light Loop without marking it complete.' })
    const loop = await read($)
    $.ui.status(loop?.status === 'active' ? `light-loop: turn ${loop.turn}` : undefined)
    return next(e)
  })

  on('tool.call', { tool: 'mcp__light-loop__start' }, async ($, e) => {
    const objective = String((e as { objective?: unknown }).objective ?? '').trim()
    if (!objective) return { deny: 'objective is required.' }
    const current = await read($)
    if (current?.status === 'active') return { deny: `A Light Loop is already active.\n${describe(current)}` }
    const loop: Loop = { objective, status: 'active', turn: 1, startedAt: await $.clock.now() }
    await $.state.set(LOOP, loop)
    $.ui.status('light-loop: turn 1')
    return { result: `Light Loop started. This is turn 1: begin the work now.\n${describe(loop)}` }
  }).catch(($, e, next) => (next.called ? next(e) : { deny: 'Light Loop failed to handle this call.' }))

  on('tool.call', { tool: 'mcp__light-loop__status' }, async $ => ({ result: describe(await read($)) })).catch(($, e, next) => (next.called ? next(e) : { deny: 'Light Loop failed to handle this call.' }))

  on('tool.call', { tool: 'mcp__light-loop__end' }, async ($, e) => {
    const input = e as { status?: unknown; reason?: unknown }
    const status = input.status === 'complete' || input.status === 'blocked' ? input.status : undefined
    const reason = String(input.reason ?? '').trim()
    if (!status || !reason) return { deny: 'status ("complete" or "blocked") and reason are required.' }
    const loop = await read($)
    if (loop?.status !== 'active') return { deny: describe(loop) }
    const ended: Loop = { ...loop, status, reason, endedAt: await $.clock.now() }
    await $.state.set(LOOP, ended)
    $.ui.status(undefined)
    return { result: `Light Loop ended as ${status}. Finish this turn with the final report.` }
  }).catch(($, e, next) => (next.called ? next(e) : { deny: 'Light Loop failed to handle this call.' }))

  on('command.run', { command: 'light-loop-stop' }, async $ => {
    const loop = await read($)
    if (loop?.status !== 'active') return { text: describe(loop) }
    await $.state.set(LOOP, { ...loop, status: 'stopped', reason: 'stopped by the user', endedAt: await $.clock.now() })
    $.ui.status(undefined)
    return { text: `Light Loop stopped at turn ${loop.turn}.` }
  })

  // An interrupted turn hands control back to the user: the loop stops.
  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (!e.agentId && e.isAborted) {
      const loop = await read($)
      if (loop?.status === 'active') {
        await $.state.set(LOOP, { ...loop, status: 'stopped', reason: 'interrupted by the user', endedAt: await $.clock.now() })
        $.ui.status(undefined)
      }
    }
    return done
  })

  on('classic.Stop', async ($, e, next) => {
    const done = await next(e)
    const loop = await read($)
    if (loop?.status !== 'active' || done.block) return done
    // Background work wakes the session itself; continuing now would only wait.
    if ((e.background_tasks?.length ?? 0) > 0) return done
    if (loop.turn >= MAX_TURNS) {
      await $.state.set(LOOP, { ...loop, status: 'stopped', reason: `reached ${MAX_TURNS} turns`, endedAt: await $.clock.now() })
      $.ui.status(undefined)
      return done
    }
    const nextLoop = { ...loop, turn: loop.turn + 1 }
    await $.state.set(LOOP, nextLoop)
    $.ui.status(`light-loop: turn ${nextLoop.turn}`)
    return { ...done, block: continuation(nextLoop) }
  })
}
