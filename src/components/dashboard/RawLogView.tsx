import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react'
import type { ActivityEvent } from '@/types/dashboard'

interface RawLogViewProps {
  events: ActivityEvent[]
  visibleCount: number
}

export function RawLogView({ events, visibleCount }: RawLogViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const visibleEvents = events.slice(0, visibleCount)

  if (visibleEvents.length === 0) return null

  return (
    <div className="border rounded-lg overflow-hidden bg-slate-950">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-slate-200">Raw Logs</span>
          <span className="text-xs text-slate-500 font-mono">
            ({visibleEvents.length} events)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-800 max-h-64 overflow-y-auto">
          <pre className="p-3 text-xs font-mono">
            {visibleEvents.map((event) => (
              <LogEntry key={event.id} event={event} />
            ))}
          </pre>
        </div>
      )}
    </div>
  )
}

function LogEntry({ event }: { event: ActivityEvent }) {
  const statusColor = event.status === 'authorized' ? 'text-green-400' : 'text-red-400'
  const statusSymbol = event.status === 'authorized' ? '✓' : '✗'

  return (
    <div className="mb-3 last:mb-0">
      <div className="text-slate-500">
        [{event.timestamp}] x402.submit()
      </div>
      <div className="pl-4 text-slate-300">
        intent: <span className="text-cyan-400">"{event.action.purpose}"</span>
      </div>
      <div className="pl-4 text-slate-300">
        target: <span className="text-yellow-400">"{event.action.target}"</span>
      </div>
      {event.action.amount !== undefined && (
        <div className="pl-4 text-slate-300">
          amount: <span className="text-purple-400">{event.action.amount} {event.action.token}</span>
        </div>
      )}
      <div className={cn("pl-4", statusColor)}>
        {statusSymbol} {event.status.toUpperCase()}
        {event.policyRule && (
          <span className="text-slate-500"> — {event.policyRule}</span>
        )}
      </div>
    </div>
  )
}
