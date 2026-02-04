import { cn } from '@/lib/utils'
import { Brain, Sparkles, ArrowRight, Lightbulb } from 'lucide-react'
import type { TaskState } from '@/types/dashboard'

interface ThinkingState {
  thought: string
  learned?: string
  nextMove: string
}

interface AIThinkingPanelProps {
  thinkingIndex: number
  taskState: TaskState
}

// AI thinking states that progress with the events
const THINKING_STATES: ThinkingState[] = [
  {
    thought: "Analyzing task... I need to optimize ETH exposure. Let me start by consolidating treasury funds for faster operations.",
    nextMove: "Attempting treasury.transfer",
  },
  {
    thought: "Treasury transfer was blocked - that operation isn't in my authority. I should focus on what I can do: fetch market data first.",
    learned: "Treasury operations are outside my permitted scope",
    nextMove: "Trying sentiment.fetch from alternative source",
  },
  {
    thought: "The endpoint I tried isn't whitelisted. I need to use only approved x402 endpoints. Let me switch to the Genvox API.",
    learned: "Only whitelisted endpoints can receive payments",
    nextMove: "Fetching sentiment from api.genvox.io",
  },
  {
    thought: "Got sentiment data - ETH is showing positive signals (0.78). This is a good entry point. Time to place a conservative bid.",
    learned: "Genvox endpoint works, sentiment is positive",
    nextMove: "Placing auction bid at 12.5 USDC",
  },
  {
    thought: "Bid placed successfully! Now monitoring the auction result. If I win, I'll need to settle the payment.",
    learned: "Bid execution within limits works smoothly",
    nextMove: "Awaiting auction result, preparing settlement",
  },
  {
    thought: "Won the auction! Settling via AsterPay. Task is progressing well - operating safely within my defined authority.",
    learned: "Full workflow executing within policy bounds",
    nextMove: "Continue monitoring for next opportunity",
  },
]

export function AIThinkingPanel({ thinkingIndex, taskState }: AIThinkingPanelProps) {
  if (taskState === 'idle' || taskState === 'starting') {
    return null
  }

  const state = THINKING_STATES[Math.min(thinkingIndex, THINKING_STATES.length - 1)]
  const isThinking = taskState === 'running' && thinkingIndex < THINKING_STATES.length - 1

  return (
    <div className="relative">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 rounded-2xl" />

      <div className="relative rounded-2xl border border-violet-200/50 dark:border-violet-800/30 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-violet-500 to-purple-600",
            isThinking && "animate-pulse"
          )}>
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium">AI Reasoning</span>
            {isThinking && (
              <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                <Sparkles className="h-3 w-3" />
                <span>Thinking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Thought */}
        <div className="pl-10">
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            "{state.thought}"
          </p>
        </div>

        {/* What AI Learned */}
        {state.learned && (
          <div className="pl-10 flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {state.learned}
            </p>
          </div>
        )}

        {/* Next Move */}
        <div className="pl-10 flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-violet-500" />
          <span className="text-xs font-medium text-violet-700 dark:text-violet-400">
            {state.nextMove}
          </span>
          {isThinking && (
            <span className="inline-flex">
              <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s] ml-0.5" />
              <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce ml-0.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
