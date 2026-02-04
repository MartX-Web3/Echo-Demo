import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConnectButton } from '@/components/ConnectButton'
import { ArrowRight, ShieldCheck, KeyRound, Zap } from 'lucide-react'

export function ConnectPage() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()

  const handleContinue = () => {
    navigate('/policy')
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Echo Policy Demo
        </h1>
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-xl text-muted-foreground">
            You are not approving transactions.
          </p>
          <p className="text-xl font-semibold text-foreground">
            You are defining authority.
          </p>
        </div>
      </div>

      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <KeyRound className="h-8 w-8 mx-auto text-primary" />
            <p className="font-medium">No Private Keys Shared</p>
            <p className="text-sm text-muted-foreground">
              Your keys never leave your wallet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <ShieldCheck className="h-8 w-8 mx-auto text-primary" />
            <p className="font-medium">Define Once</p>
            <p className="text-sm text-muted-foreground">
              Set boundaries, not approve each action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <Zap className="h-8 w-8 mx-auto text-primary" />
            <p className="font-medium">AI Operates Safely</p>
            <p className="text-sm text-muted-foreground">
              Within your defined authority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connect Section */}
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold">Connect Your Wallet</h2>
            <p className="text-sm text-muted-foreground">
              Connect to define what your AI agent can do
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
              Continue to Define AI Authority
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
