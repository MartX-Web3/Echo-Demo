import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useSignTypedData } from 'wagmi'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  OperationsSection,
  EndpointsSection,
  ConstraintsSection,
  LimitsSection,
} from '@/components/AuthoritySection'
import { PolicyPresets, POLICY_PRESETS, type PolicyPreset } from '@/components/PolicyPresets'
import { PolicyJsonView } from '@/components/PolicyJsonView'
import { usePolicy } from '@/context/PolicyContext'
import { hashPolicy } from '@/lib/policy'
import { EIP712_DOMAIN, EIP712_TYPES, USDC_ADDRESS, USDC_DECIMALS, DEMO_MERCHANT } from '@/constants/demo'
import { DEFAULT_CONSTRAINTS, DEFAULT_LIMITS } from '@/constants/policy'
import { Loader2, ShieldCheck, Settings2, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SignedPolicy } from '@/types'

type ConfigMode = 'presets' | 'custom'

export function PolicyPage() {
  const navigate = useNavigate()
  const { address } = useAccount()
  const { setPolicy } = usePolicy()
  const { signTypedDataAsync, isPending } = useSignTypedData()

  // Config mode
  const [mode, setMode] = useState<ConfigMode>('presets')
  const [selectedPreset, setSelectedPreset] = useState<string | null>('balanced')

  // Custom config state
  const [selectedOperations, setSelectedOperations] = useState<string[]>([
    'sentiment.fetch',
    'auction.bid',
  ])
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([
    'genvox-sentiment',
    'auction-bid',
    'asterpay-settle',
  ])
  const [maxPerHour, setMaxPerHour] = useState(DEFAULT_CONSTRAINTS.maxActionsPerHour)
  const [maxPerDay, setMaxPerDay] = useState(DEFAULT_CONSTRAINTS.maxActionsPerDay)
  const [maxConcurrent, setMaxConcurrent] = useState(DEFAULT_CONSTRAINTS.maxConcurrent)
  const [maxPerAction, setMaxPerAction] = useState(DEFAULT_LIMITS.maxPerAction)
  const [maxDailySpend, setMaxDailySpend] = useState(DEFAULT_LIMITS.maxDailySpend)

  // Get current config based on mode
  const getCurrentConfig = () => {
    if (mode === 'presets' && selectedPreset) {
      const preset = POLICY_PRESETS.find(p => p.id === selectedPreset)
      if (preset) {
        return {
          operations: preset.operations,
          endpoints: preset.endpoints,
          maxPerAction: preset.maxPerAction,
          maxDailySpend: preset.maxDailySpend,
          maxPerHour: preset.maxPerHour,
          maxPerDay: 10,
          maxConcurrent: 1,
        }
      }
    }
    return {
      operations: selectedOperations,
      endpoints: selectedEndpoints,
      maxPerAction,
      maxDailySpend,
      maxPerHour,
      maxPerDay,
      maxConcurrent,
    }
  }

  const config = getCurrentConfig()
  const canSign = config.operations.length > 0 && config.endpoints.length > 0 && address

  const handlePresetSelect = (preset: PolicyPreset) => {
    setSelectedPreset(preset.id)
    // Also update custom config so switching modes preserves choice
    setSelectedOperations(preset.operations)
    setSelectedEndpoints(preset.endpoints)
    setMaxPerAction(preset.maxPerAction)
    setMaxDailySpend(preset.maxDailySpend)
    setMaxPerHour(preset.maxPerHour)
  }

  const handleSign = async () => {
    if (!address || !canSign) return

    try {
      const maxAmountWei = BigInt(Math.round(config.maxPerAction * 10 ** USDC_DECIMALS))

      const signature = await signTypedDataAsync({
        domain: EIP712_DOMAIN,
        types: EIP712_TYPES,
        primaryType: 'Policy',
        message: {
          maxAmount: maxAmountWei,
          tokenAddress: USDC_ADDRESS,
          endpointTag: DEMO_MERCHANT,
        },
      })

      const policyHash = hashPolicy(config.maxPerAction)

      const signedPolicy: SignedPolicy = {
        maxAmount: config.maxPerAction,
        tokenAddress: USDC_ADDRESS,
        endpointTag: DEMO_MERCHANT,
        signature,
        policyHash,
        signerAddress: address,
      }

      setPolicy(signedPolicy)
      navigate('/dashboard')
    } catch (error) {
      console.debug('Policy signing cancelled or failed:', error)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Configure AI Authority</h1>
        <p className="text-sm text-muted-foreground">
          Define what your AI agent can do. Signed once, enforced always.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border p-1 bg-muted/30">
          <button
            onClick={() => setMode('presets')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              mode === 'presets'
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Wand2 className="h-4 w-4" />
            Quick Setup
          </button>
          <button
            onClick={() => setMode('custom')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              mode === 'custom'
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings2 className="h-4 w-4" />
            Custom Config
          </button>
        </div>
      </div>

      {/* Presets Mode */}
      {mode === 'presets' && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Select a preset</h3>
              <p className="text-xs text-muted-foreground">
                Choose a predefined configuration based on your use case
              </p>
            </div>
            <PolicyPresets
              selected={selectedPreset}
              onSelect={handlePresetSelect}
            />

            {selectedPreset && (
              <div className="pt-4 space-y-3 border-t">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Preset includes
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Operations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {config.operations.map(op => (
                        <code key={op} className="px-1.5 py-0.5 rounded bg-muted text-xs">
                          {op}
                        </code>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Limits:</span>
                    <div className="mt-1 text-xs space-y-0.5">
                      <div>{config.maxPerAction} USDC/action</div>
                      <div>{config.maxDailySpend} USDC/day</div>
                      <div>{config.maxPerHour} actions/hour</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Mode */}
      {mode === 'custom' && (
        <div className="space-y-4">
          <OperationsSection
            selected={selectedOperations}
            onChange={setSelectedOperations}
          />

          <EndpointsSection
            selected={selectedEndpoints}
            onChange={setSelectedEndpoints}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConstraintsSection
              maxPerHour={maxPerHour}
              maxPerDay={maxPerDay}
              maxConcurrent={maxConcurrent}
              onChangePerHour={setMaxPerHour}
              onChangePerDay={setMaxPerDay}
              onChangeConcurrent={setMaxConcurrent}
            />

            <LimitsSection
              maxPerAction={maxPerAction}
              maxDailySpend={maxDailySpend}
              onChangePerAction={setMaxPerAction}
              onChangeDailySpend={setMaxDailySpend}
            />
          </div>
        </div>
      )}

      {/* Policy JSON View - Developer transparency */}
      <PolicyJsonView
        policy={{
          operations: config.operations,
          endpoints: config.endpoints,
          constraints: {
            maxPerHour: config.maxPerHour,
            maxPerDay: config.maxPerDay,
            maxConcurrent: config.maxConcurrent,
          },
          limits: {
            maxPerAction: config.maxPerAction,
            maxDailySpend: config.maxDailySpend,
            token: 'USDC',
          },
          validity: {
            from: '2026-02-01',
            until: '2026-02-28',
          },
        }}
      />

      {/* Sign Section */}
      <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <CardContent className="pt-6 space-y-4">
          {/* Quick Summary */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Policy Summary</span>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span>{config.operations.length} ops</span>
              <span className="text-muted-foreground">•</span>
              <span>{config.endpoints.length} endpoints</span>
              <span className="text-muted-foreground">•</span>
              <span>≤{config.maxPerAction} USDC</span>
            </div>
          </div>

          {!canSign && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Select at least one operation and one endpoint to sign.
            </p>
          )}

          <Button
            onClick={handleSign}
            disabled={isPending || !canSign}
            className="w-full"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting Signature...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Sign Authority
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Signing defines authority bounds. No funds move at signing time.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
