export type LoopStatus = 'active' | 'complete' | 'blocked' | 'stopped'

export type Loop = {
  objective: string
  status: LoopStatus
  /** The turn now running or last run, counted from 1. */
  turn: number
  startedAt: number
  endedAt?: number
  /** Why the loop ended, in the agent's or the user's words. */
  reason?: string
}

declare module 'claude-code' {
  interface PluginState {
    'light-loop': { loop: Loop | null }
  }
}
