import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Send, Sparkles } from 'lucide-react'
import { DEFAULT_TASK } from '@/constants/dashboard'
import type { TaskState } from '@/types/dashboard'

interface TaskInputPanelProps {
  taskState: TaskState
  onStartTask: (prompt: string) => void
}

export function TaskInputPanel({ taskState, onStartTask }: TaskInputPanelProps) {
  const [prompt, setPrompt] = useState(DEFAULT_TASK.userPrompt)
  const [showResponse, setShowResponse] = useState(false)

  const handleStart = () => {
    setShowResponse(true)
    setTimeout(() => {
      onStartTask(prompt)
    }, 1200)
  }

  const isIdle = taskState === 'idle'

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Chat-like input */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={!isIdle}
                placeholder="Tell the AI what to do..."
                className="w-full h-20 p-3 text-sm border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              />
            </div>
            {isIdle && (
              <Button
                onClick={handleStart}
                disabled={!prompt.trim()}
                size="icon"
                className="h-20 w-12 rounded-xl"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* AI Response */}
        {showResponse && (
          <div className="p-4 bg-green-50/50 dark:bg-green-950/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TASK.aiResponse.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                    >
                      <Sparkles className="h-3 w-3" />
                      {item}
                    </span>
                  ))}
                </div>
                {taskState === 'running' && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                    Starting now...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
