import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Lightbulb, ArrowRight } from 'lucide-react'
import type { ActivityEvent } from '@/types/dashboard'

interface ActivityItemProps {
  event: ActivityEvent
}

export function ActivityItem({ event }: ActivityItemProps) {
  const isRejected = event.status === 'rejected'
  const isAuthorized = event.status === 'authorized'

  return (
    <div className="relative pl-10 pb-4 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border last:hidden" />

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

      {/* Compact Card */}
      <div
        className={cn(
          "rounded-xl p-3 border",
          isRejected && "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50",
          isAuthorized && "bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50"
        )}
      >
        {/* Header Row */}
        <div className="flex items-center gap-2 mb-2">
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

        {/* Action Visual */}
        <div className="flex items-center gap-2 text-sm">
          <code className="px-2 py-0.5 rounded bg-muted text-xs font-mono">
            {event.action.purpose}
          </code>
          {event.action.amount !== undefined && (
            <>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">
                {event.action.amount} {event.action.token}
              </span>
            </>
          )}
        </div>

        {/* Target (truncated) */}
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {event.action.target}
        </p>

        {/* AI Learning (compact) - only for rejections */}
        {event.aiLearning && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-inherit">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 truncate">
              {event.aiLearning}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
