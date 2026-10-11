import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

const OBJECTIVE = 'Light Loop. Read goal.md every turn.'

// The engine's own behaviour beneath the plugin, as a quiet session answers.
function quiet(on: On) {
  mock.clock(on, { now: 1000 })
  on('ui.status', e => ({ value: e.value }))
  on('command.run', () => ({ text: '' }))
  on('classic.Stop', () => ({}))
  on('turn.complete', () => ({ text: '' }))
}

async function call($: Engine, tool: string, input: Record<string, unknown> = {}) {
  return $.tool.call({ tool: `mcp__light-loop__${tool}`, tool_use_id: `t-${tool}`, ...input } as never)
}

async function stop($: Engine, background = 0) {
  return $.classic.Stop({
    stop_hook_active: false,
    background_tasks: Array.from({ length: background }, (_, i) => ({ id: `b${i}` })),
  } as never)
}

test('an active loop turns each stop into the next turn with the fixed objective', async ($, on) => {
  quiet(on)
  const started = await call($, 'start', { objective: OBJECTIVE })
  expect(String(started.result)).toContain('turn 1')

  const first = await stop($)
  expect(first.block).toContain('Light Loop turn 2')
  expect(first.block).toContain(OBJECTIVE)
  expect((await stop($)).block).toContain('Light Loop turn 3')
  expect(String((await call($, 'status')).result)).toContain('active at turn 3')
})

test('ending the loop as complete lets the session stop', async ($, on) => {
  quiet(on)
  await call($, 'start', { objective: OBJECTIVE })
  const ended = await call($, 'end', { status: 'complete', reason: 'all criteria shown' })
  expect(String(ended.result)).toContain('complete')
  expect((await stop($)).block).toBeUndefined()
  expect(String((await call($, 'status')).result)).toContain('all criteria shown')
})

test('the objective cannot be replaced while a loop is active', async ($, on) => {
  quiet(on)
  await call($, 'start', { objective: OBJECTIVE })
  const again = await call($, 'start', { objective: 'Something else' })
  expect(again.deny).toContain('already active')
  expect((await stop($)).block).toContain(OBJECTIVE)
})

test('end needs a known status and a reason', async ($, on) => {
  quiet(on)
  await call($, 'start', { objective: OBJECTIVE })
  expect((await call($, 'end', { status: 'done', reason: 'x' })).deny).toBeDefined()
  expect((await call($, 'end', { status: 'blocked', reason: '' })).deny).toBeDefined()
  expect((await stop($)).block).toContain('turn 2')
})

test('waiting background work is not interrupted by a new turn', async ($, on) => {
  quiet(on)
  await call($, 'start', { objective: OBJECTIVE })
  expect((await stop($, 1)).block).toBeUndefined()
  expect((await stop($)).block).toContain('turn 2')
})

test('an interrupted turn or the stop command ends the loop without completing it', async ($, on) => {
  quiet(on)
  await call($, 'start', { objective: OBJECTIVE })
  await $.turn.complete({ answer: '', durationMs: 1, isAborted: true, reason: 'aborted', turnId: 't1' } as never)
  expect((await stop($)).block).toBeUndefined()
  expect(String((await call($, 'status')).result)).toContain('stopped')

  await call($, 'start', { objective: OBJECTIVE })
  const stopped = await $.command.run({ command: 'light-loop-stop', args: '' } as never)
  expect(stopped.text).toContain('stopped')
  expect((await stop($)).block).toBeUndefined()
})
