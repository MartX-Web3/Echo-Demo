import { KeyRound, FileSignature, Bot, Shield, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HowEchoWorksProps {
  variant?: 'compact' | 'full'
}

export function HowEchoWorks({ variant = 'full' }: HowEchoWorksProps) {
  const isCompact = variant === 'compact'

  return (
    <div className={cn("space-y-4", isCompact && "space-y-3")}>
      {/* Title */}
      {!isCompact && (
        <h3 className="text-sm font-semibold text-center text-muted-foreground uppercase tracking-wider">
          How Echo Works
        </h3>
      )}

      {/* Flow Diagram */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2 hidden md:block" />

        <div className={cn(
          "grid gap-3",
          isCompact ? "grid-cols-4" : "grid-cols-2 md:grid-cols-4"
        )}>
          {/* Step 1: Your Keys */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className={cn(
              "rounded-full bg-primary/10 flex items-center justify-center relative z-10",
              isCompact ? "h-10 w-10" : "h-14 w-14"
            )}>
              <KeyRound className={cn("text-primary", isCompact ? "h-5 w-5" : "h-6 w-6")} />
            </div>
            <div>
              <p className={cn("font-medium", isCompact ? "text-xs" : "text-sm")}>Your Keys</p>
              {!isCompact && (
                <p className="text-xs text-muted-foreground">Stay in your wallet</p>
              )}
            </div>
          </div>

          {/* Step 2: Sign Authority */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className={cn(
              "rounded-full bg-violet-500/10 flex items-center justify-center relative z-10",
              isCompact ? "h-10 w-10" : "h-14 w-14"
            )}>
              <FileSignature className={cn("text-violet-500", isCompact ? "h-5 w-5" : "h-6 w-6")} />
            </div>
            <div>
              <p className={cn("font-medium", isCompact ? "text-xs" : "text-sm")}>Sign Authority</p>
              {!isCompact && (
                <p className="text-xs text-muted-foreground">Define what AI can do</p>
              )}
            </div>
          </div>

          {/* Step 3: AI Operates */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className={cn(
              "rounded-full bg-green-500/10 flex items-center justify-center relative z-10",
              isCompact ? "h-10 w-10" : "h-14 w-14"
            )}>
              <Bot className={cn("text-green-500", isCompact ? "h-5 w-5" : "h-6 w-6")} />
            </div>
            <div>
              <p className={cn("font-medium", isCompact ? "text-xs" : "text-sm")}>AI Operates</p>
              {!isCompact && (
                <p className="text-xs text-muted-foreground">Within your bounds</p>
              )}
            </div>
          </div>

          {/* Step 4: Policy Enforced */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className={cn(
              "rounded-full bg-amber-500/10 flex items-center justify-center relative z-10",
              isCompact ? "h-10 w-10" : "h-14 w-14"
            )}>
              <Shield className={cn("text-amber-500", isCompact ? "h-5 w-5" : "h-6 w-6")} />
            </div>
            <div>
              <p className={cn("font-medium", isCompact ? "text-xs" : "text-sm")}>Policy Enforced</p>
              {!isCompact && (
                <p className="text-xs text-muted-foreground">Violations blocked</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insight Box */}
      {!isCompact && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-violet-500/5 to-green-500/5 border border-primary/10">
          <p className="text-center text-sm">
            <span className="font-semibold">Key Insight:</span>{' '}
            <span className="text-muted-foreground">
              You delegate <em>authority</em>, not <em>keys</em>. AI can act, but only within cryptographically signed constraints.
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

// Visual comparison component
export function WithoutVsWithEcho() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Without Echo */}
      <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 space-y-3">
        <div className="flex items-center gap-2">
          <X className="h-4 w-4 text-red-500" />
          <span className="text-sm font-semibold text-red-700 dark:text-red-400">Without Echo</span>
        </div>
        <ul className="space-y-2 text-sm text-red-800/80 dark:text-red-300/80">
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">•</span>
            <span>Share private keys with AI service</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">•</span>
            <span>Approve every transaction manually</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">•</span>
            <span>AI can do anything with your funds</span>
          </li>
        </ul>
      </div>

      {/* With Echo */}
      <div className="p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20 space-y-3">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">With Echo</span>
        </div>
        <ul className="space-y-2 text-sm text-green-800/80 dark:text-green-300/80">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span>Keys never leave your wallet</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span>Sign authority once, AI runs autonomously</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span>Policy constraints are cryptographically enforced</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
