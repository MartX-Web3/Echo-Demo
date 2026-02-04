import { useState } from 'react'
import { ChevronDown, ChevronUp, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { POLICY_SNAPSHOT } from '@/constants/dashboard'

export function CollapsiblePolicyPanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Your Authority</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-[400px]" : "max-h-0"
        )}
      >
        <div className="p-4 pt-0 space-y-4 border-t">
          {/* Allowed */}
          <div className="flex flex-wrap gap-1.5 pt-3">
            {POLICY_SNAPSHOT.allowedPurposes.map((p) => (
              <span key={p} className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-mono">
                {p}
              </span>
            ))}
          </div>

          {/* Endpoints */}
          <div className="flex flex-wrap gap-1.5">
            {POLICY_SNAPSHOT.approvedEndpoints.map((e) => (
              <span key={e} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-mono">
                {e}
              </span>
            ))}
          </div>

          {/* Limits */}
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>{POLICY_SNAPSHOT.spendLimits.maxPerAction} USDC/action</span>
            <span>•</span>
            <span>{POLICY_SNAPSHOT.spendLimits.dailyLimit} USDC/day</span>
            <span>•</span>
            <span>{POLICY_SNAPSHOT.spendLimits.maxPerHour}/hour</span>
          </div>

          {/* Forbidden */}
          <div className="flex flex-wrap gap-1.5">
            {POLICY_SNAPSHOT.forbidden.map((f) => (
              <span key={f} className="px-2 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-mono line-through opacity-60">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
