/**
 * Dashboard types for conversational + autonomous task visualization
 */

export type TaskState = 'idle' | 'starting' | 'running' | 'paused' | 'stopped'

export type ActivityStatus = 'authorized' | 'rejected'

export interface ActivityEvent {
  id: string
  timestamp: string
  status: ActivityStatus
  // What AI tried/executed
  action: {
    purpose: string
    amount?: number
    token?: string
    target: string
  }
  // User-friendly explanation
  explanation: string
  // What AI learned (for rejections)
  aiLearning?: string
  // Spend tracking (for authorized)
  spendSummary?: string
}

export interface TaskConfig {
  userPrompt: string
  aiResponse: string[]
}
