import { Shield, Zap, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityEvent } from '@/types/dashboard'

interface LiveMetricsBarProps {
  events: ActivityEvent[]
  visibleCount: number
  maxDaily: number
}

export function LiveMetricsBar({ events, visibleCount, maxDaily }: LiveMetricsBarProps) {
  const visibleEvents = events.slice(0, visibleCount)

  // Calculate metrics
  const blocked = visibleEvents.filter(e => e.status === 'rejected').length
  const executed = visibleEvents.filter(e => e.status === 'authorized').length

  // Get current spend from last authorized event
  const lastAuthorized = [...visibleEvents].reverse().find(e => e.spendSummary)
  const currentSpend = lastAuthorized?.spendSummary
    ? parseFloat(lastAuthorized.spendSummary.match(/([\d.]+)/)?.[1] || '0')
    : 0
  const spendPercent = Math.min((currentSpend / maxDaily) * 100, 100)

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Blocked Counter */}
      <MetricCard
        icon={<Shield className="h-4 w-4" />}
        value={blocked}
        label="Blocked"
        variant={blocked > 0 ? 'danger' : 'muted'}
        pulse={blocked > 0}
      />

      {/* Executed Counter */}
      <MetricCard
        icon={<Zap className="h-4 w-4" />}
        value={executed}
        label="Executed"
        variant={executed > 0 ? 'success' : 'muted'}
      />

      {/* Spend Progress */}
      <div className="col-span-2 p-2 rounded-lg border bg-card">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" />
            <span>Budget</span>
          </div>
          <span className="text-xs font-mono">
            {currentSpend.toFixed(2)} / {maxDaily} USDC
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${spendPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  value: number
  label: string
  variant: 'danger' | 'success' | 'muted'
  pulse?: boolean
}

function MetricCard({ icon, value, label, variant, pulse }: MetricCardProps) {
  return (
    <div className={cn(
      "p-2 rounded-lg border text-center transition-all",
      variant === 'danger' && "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
      variant === 'success' && "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
      variant === 'muted' && "bg-muted/30"
    )}>
      <div className={cn(
        "flex items-center justify-center gap-1.5",
        variant === 'danger' && "text-red-600 dark:text-red-400",
        variant === 'success' && "text-green-600 dark:text-green-400",
        variant === 'muted' && "text-muted-foreground"
      )}>
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
        )}
        {icon}
        <span className="text-lg font-bold">{value}</span>
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  )
}
