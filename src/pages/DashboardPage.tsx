import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TaskInputPanel,
  ActivityFeed,
  TaskControls,
  CollapsiblePolicyPanel,
  KeyInsightPanel,
  RawLogView,
  LiveMetricsBar,
  PolicyCheckVisual,
  SpeedControls,
} from '@/components/dashboard'
import { usePolicy } from '@/context/PolicyContext'
import { DEMO_EVENTS, POLICY_SNAPSHOT } from '@/constants/dashboard'
import { RefreshCw, Copy, Check, Shield } from 'lucide-react'
import type { TaskState, ActivityEvent } from '@/types/dashboard'

export function DashboardPage() {
  const navigate = useNavigate()
  const { policy, clearPolicy } = usePolicy()
  const [taskState, setTaskState] = useState<TaskState>('idle')
  const [revealedCount, setRevealedCount] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [copied, setCopied] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<ActivityEvent | null>(null)

  const handleStartTask = useCallback(() => {
    setTaskState('starting')
    setRevealedCount(0)
    setTimeout(() => {
      setTaskState('running')
    }, 500)
  }, [])

  const handleEventRevealed = useCallback((index: number) => {
    setRevealedCount(index)
  }, [])

  const handleCurrentEventChange = useCallback((event: ActivityEvent | null) => {
    setCurrentEvent(event)
  }, [])

  const handlePause = useCallback(() => {
    setTaskState('paused')
  }, [])

  const handleResume = useCallback(() => {
    setTaskState('running')
  }, [])

  const handleStop = useCallback(() => {
    setTaskState('stopped')
  }, [])

  const handleSkipToEnd = useCallback(() => {
    setRevealedCount(DEMO_EVENTS.length)
    setTaskState('stopped')
  }, [])

  const handleReset = () => {
    clearPolicy()
    navigate('/')
  }

  const handleRestart = () => {
    setTaskState('idle')
    setRevealedCount(0)
    setCurrentEvent(null)
  }

  const handleCopyHash = async () => {
    if (policy?.policyHash) {
      await navigator.clipboard.writeText(policy.policyHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const policyId = policy?.policyHash ? policy.policyHash.slice(2, 10).toUpperCase() : 'A1F3B2C4'

  // Calculate stats
  const stats = useMemo(() => {
    const revealedEvents = DEMO_EVENTS.slice(0, revealedCount)
    return {
      rejections: revealedEvents.filter(e => e.status === 'rejected').length,
      successes: revealedEvents.filter(e => e.status === 'authorized').length,
    }
  }, [revealedCount])

  const allRevealed = revealedCount >= DEMO_EVENTS.length
  const showInsights = allRevealed && (taskState === 'running' || taskState === 'stopped')
  const isActive = taskState === 'running' || taskState === 'paused'

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Agent Execution</h1>
          <p className="text-xs text-muted-foreground">
            Watch how Echo enforces your policy in real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {taskState === 'running' && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Live
            </Badge>
          )}
          {taskState === 'paused' && (
            <Badge variant="secondary">Paused</Badge>
          )}
          {taskState === 'stopped' && (
            <Badge variant="outline">Stopped</Badge>
          )}

          {/* Policy Hash */}
          <button
            onClick={handleCopyHash}
            className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-mono hover:bg-muted transition-colors"
            title="Click to copy policy hash"
          >
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">{policyId}</span>
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Task Input - only when idle */}
      {(taskState === 'idle' || taskState === 'starting') && (
        <TaskInputPanel taskState={taskState} onStartTask={handleStartTask} />
      )}

      {/* Live Metrics Bar - always visible when running */}
      {taskState !== 'idle' && taskState !== 'starting' && (
        <LiveMetricsBar
          events={DEMO_EVENTS}
          visibleCount={revealedCount}
          maxDaily={POLICY_SNAPSHOT.spendLimits.dailyLimit}
        />
      )}

      {/* Policy Check Visual - shows during active processing */}
      {isActive && !allRevealed && (
        <PolicyCheckVisual
          event={currentEvent}
          isActive={taskState === 'running'}
        />
      )}

      {/* Speed Controls */}
      {isActive && !allRevealed && (
        <SpeedControls
          speed={speed}
          onSpeedChange={setSpeed}
          onSkipToEnd={handleSkipToEnd}
          disabled={taskState === 'paused'}
        />
      )}

      {/* Activity Timeline */}
      <ActivityFeed
        events={DEMO_EVENTS}
        taskState={taskState}
        revealDelay={2500}
        speed={speed}
        onEventRevealed={handleEventRevealed}
        onCurrentEventChange={handleCurrentEventChange}
      />

      {/* Playback Controls */}
      <TaskControls
        taskState={taskState}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
      />

      {/* Key Insights - after completion */}
      {showInsights && (
        <KeyInsightPanel
          rejectionCount={stats.rejections}
          successCount={stats.successes}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        />
      )}

      {/* Developer Tools - collapsible */}
      {taskState !== 'idle' && taskState !== 'starting' && (
        <div className="space-y-3">
          <RawLogView events={DEMO_EVENTS} visibleCount={revealedCount} />
          <CollapsiblePolicyPanel />
        </div>
      )}

      {/* Footer Actions */}
      {taskState !== 'idle' && (
        <div className="flex justify-center gap-2 pt-2">
          {taskState === 'stopped' && (
            <Button size="sm" onClick={handleRestart}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Run Again
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset Demo
          </Button>
        </div>
      )}
    </div>
  )
}
