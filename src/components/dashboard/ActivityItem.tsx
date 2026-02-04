import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Brain, ArrowDown, MessageCircle, ShieldAlert, Lightbulb } from 'lucide-react'
import type { ActivityEvent } from '@/types/dashboard'

interface ActivityItemProps {
  event: ActivityEvent
}

export function ActivityItem({ event }: ActivityItemProps) {
  const isRejected = event.status === 'rejected'
  const isAuthorized = event.status === 'authorized'

  return (
    <div className="relative pl-10 pb-5 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm",
          isRejected && "bg-red-100 dark:bg-red-900/50",
          isAuthorized && "bg-green-100 dark:bg-green-900/50"
        )}
      >
        {isRejected && <XCircle className="h-5 w-5 text-red-500" />}
        {isAuthorized && <CheckCircle2 className="h-5 w-5 text-green-500" />}
      </div>

      <div className="space-y-2">
        {/* Timestamp & Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{event.timestamp}</span>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              isRejected && "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
              isAuthorized && "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
            )}
          >
            {isRejected ? 'Blocked' : 'Approved'}
          </span>
        </div>

        {/* AI Thought (Before) */}
        <div className="flex items-start gap-2">
          <Brain className="h-4 w-4 text-violet-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-violet-700 dark:text-violet-300 italic">
            "{event.aiThought}"
          </p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
        </div>

        {/* Action Card */}
        <div
          className={cn(
            "rounded-xl p-3 border",
            isRejected && "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50",
            isAuthorized && "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50"
          )}
        >
          <div className="flex items-center gap-2 text-sm">
            <code className="px-2 py-0.5 rounded bg-background/80 text-xs font-mono">
              {event.action.purpose}
            </code>
            {event.action.amount !== undefined && (
              <>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">
                  {event.action.amount} {event.action.token}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {event.action.target}
          </p>
        </div>

        {/* Policy Rule (for rejections) */}
        {isRejected && event.policyRule && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30">
            <ShieldAlert className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
            <span className="text-xs font-medium text-red-700 dark:text-red-400">
              Policy: {event.policyRule}
            </span>
          </div>
        )}

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
        </div>

        {/* AI Conclusion (After) */}
        <div className="flex items-start gap-2">
          {isRejected ? (
            <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          ) : (
            <MessageCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
          )}
          <p className={cn(
            "text-sm",
            isRejected ? "text-amber-700 dark:text-amber-300" : "text-green-700 dark:text-green-300"
          )}>
            {event.aiConclusion}
          </p>
        </div>

        {/* Spend Bar (if authorized) */}
        {event.spendSummary && (
          <SpendMiniBar summary={event.spendSummary} />
        )}
      </div>
    </div>
  )
}

function SpendMiniBar({ summary }: { summary: string }) {
  const match = summary.match(/([\d.]+)\s*\/\s*([\d.]+)/)
  if (!match) return null

  const used = parseFloat(match[1])
  const total = parseFloat(match[2])
  const percent = Math.min((used / total) * 100, 100)

  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary/50 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground font-mono">
        {used.toFixed(1)}/{total}
      </span>
    </div>
  )
}
