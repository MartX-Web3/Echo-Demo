import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Shield, ArrowRight, Check, X, AlertTriangle } from 'lucide-react'
import type { ActivityEvent } from '@/types/dashboard'

interface PolicyCheckVisualProps {
  event: ActivityEvent | null
  isActive: boolean
}

export function PolicyCheckVisual({ event, isActive }: PolicyCheckVisualProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive || !event) {
      setStep(0)
      return
    }

    // Animate through steps
    const timers = [
      setTimeout(() => setStep(1), 300),  // Request received
      setTimeout(() => setStep(2), 800),  // Checking policy
      setTimeout(() => setStep(3), 1400), // Result
    ]

    return () => timers.forEach(clearTimeout)
  }, [isActive, event?.id])

  if (!event || !isActive) return null

  const isRejected = event.status === 'rejected'

  return (
    <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
      <div className="flex items-center justify-between gap-4">
        {/* Step 1: Request */}
        <div className={cn(
          "flex-1 text-center transition-all duration-300",
          step >= 1 ? "opacity-100" : "opacity-30"
        )}>
          <div className="text-xs text-muted-foreground mb-1">Request</div>
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {event.action.purpose}
          </code>
        </div>

        <ArrowRight className={cn(
          "h-4 w-4 text-muted-foreground transition-all duration-300",
          step >= 2 ? "opacity-100" : "opacity-30"
        )} />

        {/* Step 2: Policy Check */}
        <div className={cn(
          "flex-1 text-center transition-all duration-300",
          step >= 2 ? "opacity-100" : "opacity-30"
        )}>
          <div className="text-xs text-muted-foreground mb-1">Policy Check</div>
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded",
            step >= 2 && "animate-pulse bg-primary/20"
          )}>
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono">verifying...</span>
          </div>
        </div>

        <ArrowRight className={cn(
          "h-4 w-4 text-muted-foreground transition-all duration-300",
          step >= 3 ? "opacity-100" : "opacity-30"
        )} />

        {/* Step 3: Result */}
        <div className={cn(
          "flex-1 text-center transition-all duration-300",
          step >= 3 ? "opacity-100" : "opacity-30"
        )}>
          <div className="text-xs text-muted-foreground mb-1">Result</div>
          {step >= 3 && (
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded font-medium text-xs",
              isRejected
                ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                : "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
            )}>
              {isRejected ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  BLOCKED
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  APPROVED
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* What would have happened (for rejections) */}
      {step >= 3 && isRejected && event.action.amount && (
        <div className="mt-3 p-2 rounded bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-medium text-red-700 dark:text-red-300">Without Echo: </span>
              <span className="text-red-600 dark:text-red-400">
                Would have sent {event.action.amount} {event.action.token} to {event.action.target}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
