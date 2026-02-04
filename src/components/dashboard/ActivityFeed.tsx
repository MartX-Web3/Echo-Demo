import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ActivityItem } from './ActivityItem'
import { Activity, CheckCircle2, Loader2, Wallet } from 'lucide-react'
import type { ActivityEvent, TaskState } from '@/types/dashboard'

interface ActivityFeedProps {
  events: ActivityEvent[]
  taskState: TaskState
  revealDelay?: number
}

function GlobalSpendBar({ events, visibleCount }: { events: ActivityEvent[]; visibleCount: number }) {
  // Get the latest spend summary from visible events
  const visibleEvents = events.slice(0, visibleCount)
  const lastEventWithSpend = [...visibleEvents].reverse().find(e => e.spendSummary)

  if (!lastEventWithSpend?.spendSummary) return null

  const match = lastEventWithSpend.spendSummary.match(/([\d.]+)\s*\/\s*([\d.]+)/)
  if (!match) return null

  const used = parseFloat(match[1])
  const total = parseFloat(match[2])
  const percent = Math.min((used / total) * 100, 100)

  return (
    <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-muted/50">
      <Wallet className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground">
        {used.toFixed(1)} / {total} USDC
      </span>
    </div>
  )
}

export function ActivityFeed({ events, taskState, revealDelay = 2500 }: ActivityFeedProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  const isRunning = taskState === 'running'
  const isPaused = taskState === 'paused'

  useEffect(() => {
    if (isRunning && visibleCount < events.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1)
      }, revealDelay)
      return () => clearTimeout(timer)
    }
  }, [isRunning, visibleCount, events.length, revealDelay])

  useEffect(() => {
    if (taskState === 'running' && visibleCount === 0) {
      const timer = setTimeout(() => {
        setVisibleCount(1)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [taskState, visibleCount])

  const visibleEvents = events.slice(0, visibleCount)
  const allRevealed = visibleCount >= events.length

  // Check if any visible event has spend data
  const hasSpendData = useMemo(() => {
    return visibleEvents.some(e => e.spendSummary)
  }, [visibleEvents])

  if (taskState === 'idle' || taskState === 'starting') {
    return null
  }

  return (
    <Card>
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Activity</span>
          </div>
          {isRunning && !allRevealed && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing...
            </div>
          )}
          {allRevealed && isRunning && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              Running
            </div>
          )}
        </div>

        {/* Global Spend Progress */}
        {hasSpendData && <GlobalSpendBar events={events} visibleCount={visibleCount} />}

        {/* Timeline */}
        {visibleCount === 0 ? (
          <div className="flex items-center justify-center py-8 gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Initializing...
          </div>
        ) : (
          <div className="space-y-0">
            {visibleEvents.map((event) => (
              <ActivityItem key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Paused indicator */}
        {isPaused && (
          <div className="mt-3 py-2 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-center">
            <span className="text-xs text-amber-600 dark:text-amber-400">Paused</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
