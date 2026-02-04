import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { HelpCircle, Lock, ExternalLink, Calendar } from 'lucide-react'
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
}

export function AuthoritySection({ title, description, children, className }: AuthoritySectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// A. Allowed Operations (Intent Types) - Multi-select
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
      title="A. Allowed Operations"
      description="Select which intent types the AI agent may propose"
    >
      <div className="space-y-4">
        {/* Enabled intents */}
        <div className="space-y-3">
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
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Restricted operations (not available)
          </p>
          {disabledIntents.map((intent) => (
            <IntentCheckbox
              key={intent.id}
              intent={intent}
              checked={false}
              onChange={() => {}}
              disabled
            />
          ))}
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
      className="py-1"
    >
      <div className="flex flex-col">
        <span className={cn(
          "font-mono text-sm",
          disabled && "text-muted-foreground"
        )}>
          {intent.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {intent.description}
        </span>
      </div>
    </Checkbox>
  )
}

// B. Approved x402 Endpoint Whitelist
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
      title="B. Approved x402 Endpoints"
      description="Select which services the AI can pay automatically"
    >
      <div className="space-y-3">
        {X402_ENDPOINTS.map((endpoint) => (
          <EndpointCheckbox
            key={endpoint.id}
            endpoint={endpoint}
            checked={selected.includes(endpoint.id)}
            onChange={(checked) => handleToggle(endpoint.id, checked)}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
        <HelpCircle className="h-3 w-3" />
        These are x402-protected services the AI can pay without asking for each transaction.
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
      className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{endpoint.label}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {endpoint.category}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-mono truncate">
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{endpoint.uri}</span>
        </div>
        <div className="mt-1 text-xs text-primary">
          {endpoint.pricingHint}
        </div>
      </div>
    </Checkbox>
  )
}

// C. Execution Constraints
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
      title="C. Execution Constraints"
      description="Set rate limits to prevent runaway spend"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ConstraintInput
          label="Max actions/hour"
          value={maxPerHour}
          onChange={onChangePerHour}
          min={1}
          max={10}
        />
        <ConstraintInput
          label="Max actions/day"
          value={maxPerDay}
          onChange={onChangePerDay}
          min={1}
          max={100}
        />
        <ConstraintInput
          label="Max concurrent"
          value={maxConcurrent}
          onChange={onChangeConcurrent}
          min={1}
          max={5}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Requests exceeding these limits will be automatically rejected.
      </p>
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
    <div className="space-y-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || min)}
        min={min}
        max={max}
        className="w-full px-3 py-2 text-sm border rounded-md bg-background font-mono"
      />
    </div>
  )
}

// D. Financial Limits
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
      title="D. Financial Limits"
      description="Amount caps apply after purpose and endpoint checks"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Max per action</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={maxPerAction}
              onChange={(e) => onChangePerAction(parseInt(e.target.value, 10) || 1)}
              min={1}
              max={1000}
              className="w-24 px-3 py-2 text-sm border rounded-md bg-background font-mono"
            />
            <span className="text-sm font-medium">USDC</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">Max daily spend</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={maxDailySpend}
              onChange={(e) => onChangeDailySpend(parseInt(e.target.value, 10) || 1)}
              min={1}
              max={10000}
              className="w-24 px-3 py-2 text-sm border rounded-md bg-background font-mono"
            />
            <span className="text-sm font-medium">USDC</span>
          </div>
        </div>
      </div>
      <div className="mt-3 p-2 rounded bg-muted/50 text-xs text-muted-foreground">
        Policy validation order: Purpose check → Endpoint whitelist check → Amount check
      </div>
    </AuthoritySection>
  )
}

// E. Validity Window (Optional)
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
      title="E. Validity Window"
      description="Optional: Set when this policy is active"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Valid from
          </label>
          <input
            type="date"
            value={validFrom}
            onChange={(e) => onChangeFrom(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Valid until
          </label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => onChangeUntil(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
          />
        </div>
      </div>
    </AuthoritySection>
  )
}
