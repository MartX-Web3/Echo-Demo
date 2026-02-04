import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConnectButton } from '@/components/ConnectButton'
import { HowEchoWorks, WithoutVsWithEcho } from '@/components/HowEchoWorks'
import { ArrowRight, Sparkles } from 'lucide-react'

export function ConnectPage() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()

  const handleContinue = () => {
    navigate('/policy')
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          <span>AI Agent Authorization Layer</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Echo Policy Demo
        </h1>

        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-xl text-muted-foreground">
            Give AI agents spending authority
          </p>
          <p className="text-xl font-semibold text-foreground">
            without sharing your private keys.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <HowEchoWorks variant="full" />
        </CardContent>
      </Card>

      {/* Before/After Comparison */}
      <WithoutVsWithEcho />

      {/* x402 Protocol Explainer */}
      <div className="p-4 rounded-xl bg-muted/30 border">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-mono text-xs font-bold">402</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Built on x402 Protocol</p>
            <p className="text-xs text-muted-foreground">
              x402 enables machine-to-machine payments. Your AI agent can pay for services (APIs, data feeds, compute)
              using your signed authority — without ever touching your private keys.
            </p>
          </div>
        </div>
      </div>

      {/* Connect Section */}
      <Card className="border-primary/20">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold">Try the Demo</h2>
            <p className="text-sm text-muted-foreground">
              Connect your wallet to define AI authority and watch it operate safely.
            </p>
          </div>

          <div className="flex justify-center">
            <ConnectButton />
          </div>

          {isConnected && (
            <Button
              onClick={handleContinue}
              className="w-full"
              size="lg"
            >
              Define AI Authority
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Footer Note */}
      <p className="text-center text-xs text-muted-foreground">
        This is a demo. No real funds will be moved.
      </p>
    </div>
  )
}
