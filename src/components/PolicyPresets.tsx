import { cn } from '@/lib/utils'
import { Shield, Zap, Lock } from 'lucide-react'

export interface PolicyPreset {
  id: string
  name: string
  description: string
  icon: 'conservative' | 'balanced' | 'permissive'
  operations: string[]
  endpoints: string[]
  maxPerAction: number
  maxDailySpend: number
  maxPerHour: number
}

export const POLICY_PRESETS: PolicyPreset[] = [
  {
    id: 'conservative',
    name: 'Conservative',
    description: 'Read-only data + minimal spend',
    icon: 'conservative',
    operations: ['sentiment.fetch'],
    endpoints: ['genvox-sentiment'],
    maxPerAction: 10,
    maxDailySpend: 50,
    maxPerHour: 2,
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Data + trading within limits',
    icon: 'balanced',
    operations: ['sentiment.fetch', 'auction.bid'],
    endpoints: ['genvox-sentiment', 'auction-bid', 'asterpay-settle'],
    maxPerAction: 50,
    maxDailySpend: 120,
    maxPerHour: 3,
  },
  {
    id: 'permissive',
    name: 'Permissive',
    description: 'Full automation capabilities',
    icon: 'permissive',
    operations: ['sentiment.fetch', 'auction.bid', 'nft.mint', 'custom.analytics'],
    endpoints: ['genvox-sentiment', 'auction-bid', 'nft-mint', 'asterpay-settle'],
    maxPerAction: 100,
    maxDailySpend: 500,
    maxPerHour: 10,
  },
]

interface PolicyPresetsProps {
  selected: string | null
  onSelect: (preset: PolicyPreset) => void
}

export function PolicyPresets({ selected, onSelect }: PolicyPresetsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {POLICY_PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset)}
          className={cn(
            "p-3 rounded-xl border-2 text-left transition-all",
            "hover:border-primary/50 hover:bg-primary/5",
            selected === preset.id
              ? "border-primary bg-primary/5"
              : "border-border"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            {preset.icon === 'conservative' && (
              <Lock className="h-4 w-4 text-blue-500" />
            )}
            {preset.icon === 'balanced' && (
              <Shield className="h-4 w-4 text-green-500" />
            )}
            {preset.icon === 'permissive' && (
              <Zap className="h-4 w-4 text-amber-500" />
            )}
            <span className="font-medium text-sm">{preset.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">{preset.description}</p>
          <div className="mt-2 text-xs font-mono text-muted-foreground">
            ≤{preset.maxPerAction} USDC/action
          </div>
        </button>
      ))}
    </div>
  )
}
