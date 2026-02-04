import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { HelpCircle, Lock, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  INTENT_TYPES,
  X402_ENDPOINTS,
  type IntentType,
  type Endpoint,
} from '@/constants/policy'

interface AuthoritySectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  compact?: boolean
}

export function AuthoritySection({ title, description, children, className, compact }: AuthoritySectionProps) {
  return (
    <Card className={className}>
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className={compact ? "pt-0" : ""}>{children}</CardContent>
    </Card>
  )
}

// Allowed Operations (Intent Types) - Multi-select
interface OperationsSectionProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

export function OperationsSection({ selected, onChange }: OperationsSectionProps) {
  const handleToggle = (intentId: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, intentId])
    } else {
      onChange(selected.filter(id => id !== intentId))
    }
  }

  const enabledIntents = INTENT_TYPES.filter(i => i.enabled)
  const disabledIntents = INTENT_TYPES.filter(i => !i.enabled)

  return (
    <AuthoritySection
      title="Allowed Intents"
      description="Which x402 intent types can the agent submit?"
    >
      <div className="space-y-4">
        {/* Enabled intents */}
        <div className="grid grid-cols-2 gap-2">
          {enabledIntents.map((intent) => (
            <IntentCheckbox
              key={intent.id}
              intent={intent}
              checked={selected.includes(intent.id)}
              onChange={(checked) => handleToggle(intent.id, checked)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t pt-3">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Restricted (never allowed)
          </p>
          <div className="flex flex-wrap gap-2">
            {disabledIntents.map((intent) => (
              <span
                key={intent.id}
                className="px-2 py-1 text-xs font-mono rounded bg-muted text-muted-foreground line-through"
              >
                {intent.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AuthoritySection>
  )
}

function IntentCheckbox({
  intent,
  checked,
  onChange,
  disabled = false,
}: {
  intent: IntentType
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <Checkbox
      id={`intent-${intent.id}`}
      checked={checked}
      onChange={onChange}
      disabled={disabled || !intent.enabled}
      className="p-2 rounded-lg border bg-muted/30 hover:bg-muted/50"
    >
      <div className="flex flex-col">
        <span className={cn(
          "font-mono text-xs",
          disabled && "text-muted-foreground"
        )}>
          {intent.label}
        </span>
        <span className="text-[10px] text-muted-foreground leading-tight">
          {intent.description}
        </span>
      </div>
    </Checkbox>
  )
}

// Approved x402 Endpoint Whitelist
interface EndpointsSectionProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

export function EndpointsSection({ selected, onChange }: EndpointsSectionProps) {
  const handleToggle = (endpointId: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, endpointId])
    } else {
      onChange(selected.filter(id => id !== endpointId))
    }
  }

  return (
    <AuthoritySection
      title="Approved Endpoints"
      description="Which x402 services can receive payments?"
    >
      <div className="space-y-2">
        {X402_ENDPOINTS.map((endpoint) => (
          <EndpointCheckbox
            key={endpoint.id}
            endpoint={endpoint}
            checked={selected.includes(endpoint.id)}
            onChange={(checked) => handleToggle(endpoint.id, checked)}
          />
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
        <HelpCircle className="h-3 w-3" />
        Payments to non-whitelisted endpoints are automatically rejected.
      </p>
    </AuthoritySection>
  )
}

function EndpointCheckbox({
  endpoint,
  checked,
  onChange,
}: {
  endpoint: Endpoint
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <Checkbox
      id={`endpoint-${endpoint.id}`}
      checked={checked}
      onChange={onChange}
      className="p-2 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs">{endpoint.label}</span>
          <span className="text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground">
            {endpoint.category}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground font-mono truncate">
          <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
          <span className="truncate">{endpoint.uri}</span>
        </div>
        <div className="mt-0.5 text-[10px] text-primary font-medium">
          {endpoint.pricingHint}
        </div>
      </div>
    </Checkbox>
  )
}

// Execution Constraints
interface ConstraintsSectionProps {
  maxPerHour: number
  maxPerDay: number
  maxConcurrent: number
  onChangePerHour: (value: number) => void
  onChangePerDay: (value: number) => void
  onChangeConcurrent: (value: number) => void
}

export function ConstraintsSection({
  maxPerHour,
  maxPerDay,
  maxConcurrent,
  onChangePerHour,
  onChangePerDay,
  onChangeConcurrent,
}: ConstraintsSectionProps) {
  return (
    <AuthoritySection
      title="Rate Limits"
      description="Prevent runaway automation"
      compact
    >
      <div className="space-y-3">
        <ConstraintInput
          label="Per hour"
          value={maxPerHour}
          onChange={onChangePerHour}
          min={1}
          max={10}
        />
        <ConstraintInput
          label="Per day"
          value={maxPerDay}
          onChange={onChangePerDay}
          min={1}
          max={100}
        />
        <ConstraintInput
          label="Concurrent"
          value={maxConcurrent}
          onChange={onChangeConcurrent}
          min={1}
          max={5}
        />
      </div>
    </AuthoritySection>
  )
}

function ConstraintInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || min)}
        min={min}
        max={max}
        className="w-16 px-2 py-1 text-xs border rounded bg-background font-mono text-right"
      />
    </div>
  )
}

// Financial Limits
interface LimitsSectionProps {
  maxPerAction: number
  maxDailySpend: number
  onChangePerAction: (value: number) => void
  onChangeDailySpend: (value: number) => void
}

export function LimitsSection({
  maxPerAction,
  maxDailySpend,
  onChangePerAction,
  onChangeDailySpend,
}: LimitsSectionProps) {
  return (
    <AuthoritySection
      title="Spending Caps"
      description="Maximum USDC amounts"
      compact
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Per action</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={maxPerAction}
              onChange={(e) => onChangePerAction(parseInt(e.target.value, 10) || 1)}
              min={1}
              max={1000}
              className="w-16 px-2 py-1 text-xs border rounded bg-background font-mono text-right"
            />
            <span className="text-xs text-muted-foreground">USDC</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Daily total</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={maxDailySpend}
              onChange={(e) => onChangeDailySpend(parseInt(e.target.value, 10) || 1)}
              min={1}
              max={10000}
              className="w-16 px-2 py-1 text-xs border rounded bg-background font-mono text-right"
            />
            <span className="text-xs text-muted-foreground">USDC</span>
          </div>
        </div>
      </div>
    </AuthoritySection>
  )
}

// Validity Window (Optional) - Keeping for completeness but not used in new design
interface ValiditySectionProps {
  validFrom: string
  validUntil: string
  onChangeFrom: (value: string) => void
  onChangeUntil: (value: string) => void
}

export function ValiditySection({
  validFrom,
  validUntil,
  onChangeFrom,
  onChangeUntil,
}: ValiditySectionProps) {
  return (
    <AuthoritySection
      title="Validity Window"
      description="When is this policy active?"
      compact
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">From</label>
          <input
            type="date"
            value={validFrom}
            onChange={(e) => onChangeFrom(e.target.value)}
            className="px-2 py-1 text-xs border rounded bg-background"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Until</label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => onChangeUntil(e.target.value)}
            className="px-2 py-1 text-xs border rounded bg-background"
          />
        </div>
      </div>
    </AuthoritySection>
  )
}
