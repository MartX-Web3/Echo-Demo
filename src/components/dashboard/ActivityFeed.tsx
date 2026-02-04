import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ActivityItem } from './ActivityItem'
import { Activity, CheckCircle2, Loader2 } from 'lucide-react'
import type { ActivityEvent, TaskState } from '@/types/dashboard'

interface ActivityFeedProps {
  events: ActivityEvent[]
  taskState: TaskState
  revealDelay?: number
  speed?: number
  onEventRevealed?: (index: number) => void
  onCurrentEventChange?: (event: ActivityEvent | null) => void
}

export function ActivityFeed({
  events,
  taskState,
  revealDelay = 2500,
  speed = 1,
  onEventRevealed,
  onCurrentEventChange,
}: ActivityFeedProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  const isRunning = taskState === 'running'
  const isPaused = taskState === 'paused'
  const actualDelay = revealDelay / speed

  useEffect(() => {
    if (isRunning && visibleCount < events.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => {
          const next = prev + 1
          onEventRevealed?.(next)
          return next
        })
      }, actualDelay)
      return () => clearTimeout(timer)
    }
  }, [isRunning, visibleCount, events.length, actualDelay, onEventRevealed])

  useEffect(() => {
    if (taskState === 'running' && visibleCount === 0) {
      const timer = setTimeout(() => {
        setVisibleCount(1)
        onEventRevealed?.(1)
      }, 800 / speed)
      return () => clearTimeout(timer)
    }
  }, [taskState, visibleCount, onEventRevealed, speed])

  // Notify parent of current event being processed
  useEffect(() => {
    if (isRunning && visibleCount > 0 && visibleCount <= events.length) {
      onCurrentEventChange?.(events[visibleCount - 1])
    } else {
      onCurrentEventChange?.(null)
    }
  }, [isRunning, visibleCount, events, onCurrentEventChange])

  // Reset when task restarts
  useEffect(() => {
    if (taskState === 'idle') {
      setVisibleCount(0)
    }
  }, [taskState])

  const visibleEvents = events.slice(0, visibleCount)
  const allRevealed = visibleCount >= events.length

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
            <span className="text-sm font-medium">Activity Log</span>
            <span className="text-xs text-muted-foreground font-mono">
              ({visibleCount}/{events.length})
            </span>
          </div>
          {isRunning && !allRevealed && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing...
            </div>
          )}
          {allRevealed && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              Complete
            </div>
          )}
        </div>

        {/* Timeline */}
        {visibleCount === 0 ? (
          <div className="flex items-center justify-center py-8 gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Initializing agent...
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

// Export a function to skip to end
export function useActivityFeedControls() {
  const [visibleCount, setVisibleCount] = useState(0)

  const skipToEnd = (totalEvents: number) => {
    setVisibleCount(totalEvents)
  }

  return { visibleCount, setVisibleCount, skipToEnd }
}
