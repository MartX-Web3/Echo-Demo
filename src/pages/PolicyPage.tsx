import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useSignTypedData } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  OperationsSection,
  EndpointsSection,
  ConstraintsSection,
  LimitsSection,
  ValiditySection,
} from '@/components/AuthoritySection'
import { usePolicy } from '@/context/PolicyContext'
import { hashPolicy } from '@/lib/policy'
import { EIP712_DOMAIN, EIP712_TYPES, USDC_ADDRESS, USDC_DECIMALS, DEMO_MERCHANT } from '@/constants/demo'
import { DEFAULT_CONSTRAINTS, DEFAULT_LIMITS, DEFAULT_VALIDITY } from '@/constants/policy'
import { Loader2, ShieldCheck, Info } from 'lucide-react'
import type { SignedPolicy } from '@/types'

export function PolicyPage() {
  const navigate = useNavigate()
  const { address } = useAccount()
  const { setPolicy } = usePolicy()
  const { signTypedDataAsync, isPending } = useSignTypedData()

  // A. Allowed Operations (multi-select)
  const [selectedOperations, setSelectedOperations] = useState<string[]>([
    'sentiment.fetch',
    'auction.bid',
  ])

  // B. Approved Endpoints (multi-select)
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([
    'auction-bid',
    'asterpay-settle',
  ])

  // C. Execution Constraints
  const [maxPerHour, setMaxPerHour] = useState(DEFAULT_CONSTRAINTS.maxActionsPerHour)
  const [maxPerDay, setMaxPerDay] = useState(DEFAULT_CONSTRAINTS.maxActionsPerDay)
  const [maxConcurrent, setMaxConcurrent] = useState(DEFAULT_CONSTRAINTS.maxConcurrent)

  // D. Financial Limits
  const [maxPerAction, setMaxPerAction] = useState(DEFAULT_LIMITS.maxPerAction)
  const [maxDailySpend, setMaxDailySpend] = useState(DEFAULT_LIMITS.maxDailySpend)

  // E. Validity Window
  const [validFrom, setValidFrom] = useState(DEFAULT_VALIDITY.validFrom)
  const [validUntil, setValidUntil] = useState(DEFAULT_VALIDITY.validUntil)

  const canSign = selectedOperations.length > 0 && selectedEndpoints.length > 0 && address

  const handleSign = async () => {
    if (!address || !canSign) return

    try {
      // Convert human-readable amount to wei (USDC has 6 decimals)
      const maxAmountWei = BigInt(Math.round(maxPerAction * 10 ** USDC_DECIMALS))

      // Sign the policy using EIP-712
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

      // Compute the policy hash
      const policyHash = hashPolicy(maxPerAction)

      // Create the signed policy object
      const signedPolicy: SignedPolicy = {
        maxAmount: maxPerAction,
        tokenAddress: USDC_ADDRESS,
        endpointTag: DEMO_MERCHANT,
        signature,
        policyHash,
        signerAddress: address,
      }

      setPolicy(signedPolicy)
      navigate('/dashboard')
    } catch (error) {
      // User rejected the signature or another error occurred
      console.debug('Policy signing cancelled or failed:', error)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Define AI Authority</h1>
        <p className="text-muted-foreground">
          Specify concrete rules for what your AI agent can do. Sign once, then step back.
        </p>
      </div>

      {/* Authority Sections */}
      <div className="space-y-4">
        <OperationsSection
          selected={selectedOperations}
          onChange={setSelectedOperations}
        />

        <EndpointsSection
          selected={selectedEndpoints}
          onChange={setSelectedEndpoints}
        />

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

        <ValiditySection
          validFrom={validFrom}
          validUntil={validUntil}
          onChangeFrom={setValidFrom}
          onChangeUntil={setValidUntil}
        />
      </div>

      {/* F. Signature Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">F. Policy Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">You are signing an AI authority definition</p>
              <p className="mt-1 text-blue-700 dark:text-blue-300">
                This signature defines the authority the AI may exercise — it does not approve any specific transaction or move funds at signing time.
              </p>
            </div>
          </div>

          {/* Policy Summary */}
          <div className="p-3 rounded-md bg-muted/50 text-sm space-y-2">
            <p className="font-medium">Policy Summary:</p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• {selectedOperations.length} allowed operation(s): {selectedOperations.join(', ') || 'none'}</li>
              <li>• {selectedEndpoints.length} whitelisted endpoint(s)</li>
              <li>• Rate limit: {maxPerHour}/hour, {maxPerDay}/day</li>
              <li>• Max spend: {maxPerAction} USDC/action, {maxDailySpend} USDC/day</li>
              <li>• Valid: {validFrom} to {validUntil}</li>
            </ul>
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
                Signing Authority...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Sign Policy (No Funds Move)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
