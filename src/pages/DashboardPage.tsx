import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TaskInputPanel,
  ActivityFeed,
  TaskControls,
  CollapsiblePolicyPanel,
} from '@/components/dashboard'
import { usePolicy } from '@/context/PolicyContext'
import { DEMO_EVENTS } from '@/constants/dashboard'
import { RefreshCw, Lock, KeyRound, Shield } from 'lucide-react'
import type { TaskState } from '@/types/dashboard'

export function DashboardPage() {
  const navigate = useNavigate()
  const { policy, clearPolicy } = usePolicy()
  const [taskState, setTaskState] = useState<TaskState>('idle')

  const handleStartTask = useCallback(() => {
    setTaskState('starting')
    setTimeout(() => {
      setTaskState('running')
    }, 500)
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

  const handleReset = () => {
    clearPolicy()
    navigate('/')
  }

  const handleRestart = () => {
    setTaskState('idle')
  }

  const policyId = policy?.policyHash ? policy.policyHash.slice(2, 6).toUpperCase() : 'A1F3'

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Watch AI Operate</h1>

        {/* Status */}
        <div className="flex items-center justify-center gap-2">
          {taskState === 'running' && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Active
            </Badge>
          )}
          {taskState === 'paused' && (
            <Badge variant="secondary">Paused</Badge>
          )}
          {taskState === 'stopped' && (
            <Badge variant="secondary">Stopped</Badge>
          )}
          <Badge variant="outline" className="font-mono text-xs">
            <Lock className="h-3 w-3 mr-1" />
            #{policyId}
          </Badge>
        </div>
      </div>

      {/* Task Input */}
      {(taskState === 'idle' || taskState === 'starting') && (
        <TaskInputPanel taskState={taskState} onStartTask={handleStartTask} />
      )}

      {/* Activity */}
      <ActivityFeed events={DEMO_EVENTS} taskState={taskState} revealDelay={2000} />

      {/* Controls */}
      <TaskControls
        taskState={taskState}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
      />

      {/* Policy (collapsed) */}
      {taskState !== 'idle' && taskState !== 'starting' && (
        <CollapsiblePolicyPanel />
      )}

      {/* Footer */}
      {taskState !== 'idle' && (
        <div className="space-y-4 pt-2">
          {/* Key points - visual */}
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              <span>Keys safe</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Policy enforced</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-2">
            {taskState === 'stopped' && (
              <Button size="sm" onClick={handleRestart}>
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Restart
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset Demo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
