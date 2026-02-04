import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Code, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PolicyJsonViewProps {
  policy: {
    operations: string[]
    endpoints: string[]
    constraints: {
      maxPerHour: number
      maxPerDay: number
      maxConcurrent: number
    }
    limits: {
      maxPerAction: number
      maxDailySpend: number
      token: string
    }
    validity: {
      from: string
      until: string
    }
  }
  className?: string
}

export function PolicyJsonView({ policy, className }: PolicyJsonViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const policyJson = JSON.stringify({
    version: "1.0",
    authority: {
      allowedIntents: policy.operations,
      allowedEndpoints: policy.endpoints.map(id => ({
        id,
        // Map to actual URIs in real implementation
      })),
    },
    constraints: {
      rateLimit: {
        maxPerHour: policy.constraints.maxPerHour,
        maxPerDay: policy.constraints.maxPerDay,
        maxConcurrent: policy.constraints.maxConcurrent,
      },
      spending: {
        maxPerAction: `${policy.limits.maxPerAction} ${policy.limits.token}`,
        maxDaily: `${policy.limits.maxDailySpend} ${policy.limits.token}`,
      },
    },
    validity: {
      notBefore: policy.validity.from,
      notAfter: policy.validity.until,
    },
  }, null, 2)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(policyJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between bg-muted/50 hover:bg-muted/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">View Policy JSON</span>
          <span className="text-xs text-muted-foreground font-mono">
            (EIP-712 typed data)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2 h-7 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
          <pre className="p-3 text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 dark:bg-slate-900">
            <code>{policyJson}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

// Compact signature info display
interface SignatureInfoProps {
  policyHash?: string
  signature?: string
}

export function SignatureInfo({ policyHash, signature }: SignatureInfoProps) {
  if (!policyHash && !signature) return null

  return (
    <div className="p-3 rounded-lg bg-slate-950 text-slate-50 dark:bg-slate-900 font-mono text-xs space-y-2">
      {policyHash && (
        <div>
          <span className="text-slate-400">policyHash: </span>
          <span className="text-green-400">{policyHash.slice(0, 10)}...{policyHash.slice(-8)}</span>
        </div>
      )}
      {signature && (
        <div>
          <span className="text-slate-400">signature: </span>
          <span className="text-blue-400">{signature.slice(0, 10)}...{signature.slice(-8)}</span>
        </div>
      )}
    </div>
  )
}
