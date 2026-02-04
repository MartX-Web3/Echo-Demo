import { Button } from '@/components/ui/button'
import { Pause, Play, Square } from 'lucide-react'
import type { TaskState } from '@/types/dashboard'

interface TaskControlsProps {
  taskState: TaskState
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export function TaskControls({ taskState, onPause, onResume, onStop }: TaskControlsProps) {
  const isRunning = taskState === 'running'
  const isPaused = taskState === 'paused'

  if (taskState === 'idle' || taskState === 'starting') {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {isRunning && (
        <Button variant="outline" size="sm" onClick={onPause} className="gap-2">
          <Pause className="h-4 w-4" />
          Pause
        </Button>
      )}

      {isPaused && (
        <Button variant="outline" size="sm" onClick={onResume} className="gap-2">
          <Play className="h-4 w-4" />
          Resume
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onStop}
        className="gap-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <Square className="h-4 w-4" />
        Stop
      </Button>
    </div>
  )
}
