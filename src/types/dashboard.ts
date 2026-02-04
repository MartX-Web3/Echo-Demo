/**
 * Dashboard types for conversational + autonomous task visualization
 */

export type TaskState = 'idle' | 'starting' | 'running' | 'paused' | 'stopped'

export type ActivityStatus = 'authorized' | 'rejected'

export interface ActivityEvent {
  id: string
  timestamp: string
  status: ActivityStatus
  // AI's thought before action
  aiThought: string
  // What AI tried/executed
  action: {
    purpose: string
    amount?: number
    token?: string
    target: string
  }
  // What AI concluded after result
  aiConclusion: string
  // Which policy rule caused rejection (for rejected events)
  policyRule?: string
  // Spend tracking (for authorized)
  spendSummary?: string
}

export interface TaskConfig {
  userPrompt: string
  aiResponse: string[]
}
