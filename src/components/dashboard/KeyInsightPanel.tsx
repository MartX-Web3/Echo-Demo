import { Shield, Brain, KeyRound, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KeyInsightPanelProps {
  rejectionCount: number
  successCount: number
  className?: string
}

export function KeyInsightPanel({ rejectionCount, successCount, className }: KeyInsightPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Danger Prevented - Most Important */}
      {rejectionCount > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800/50">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-700 dark:text-red-300">
                {rejectionCount} Unauthorized Action{rejectionCount > 1 ? 's' : ''} Blocked
              </h3>
              <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                Without Echo, these would have executed with your funds.
                Your policy stopped them before any damage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What Happened Summary */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 via-violet-500/5 to-green-500/5 border border-primary/10">
        <h3 className="text-sm font-semibold text-center mb-4">What Just Happened</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Left: Security */}
          <div className="space-y-3">
            <InsightItem
              icon={<Shield className="h-4 w-4 text-red-500" />}
              title="Policy Enforced"
              description={`${rejectionCount} blocked, ${successCount} approved`}
            />
            <InsightItem
              icon={<KeyRound className="h-4 w-4 text-primary" />}
              title="Keys Protected"
              description="Never left your wallet"
            />
          </div>

          {/* Right: AI Behavior */}
          <div className="space-y-3">
            <InsightItem
              icon={<Brain className="h-4 w-4 text-violet-500" />}
              title="AI Adapted"
              description="Learned from rejections"
            />
            <InsightItem
              icon={<Check className="h-4 w-4 text-green-500" />}
              title="Task Completed"
              description="Within authority bounds"
            />
          </div>
        </div>

        {/* One-liner */}
        <div className="mt-4 pt-4 border-t border-primary/10 text-center">
          <p className="text-sm">
            <span className="text-muted-foreground">This is </span>
            <span className="font-semibold text-primary">Echo</span>
            <span className="text-muted-foreground">: Sign authority once, AI operates safely forever.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function InsightItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}
