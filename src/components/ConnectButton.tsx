import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="font-mono text-sm">{shortenAddress(address)}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    )
  }

  if (isPending) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            variant="outline"
          >
            Connect {connector.name}
          </Button>
        ))}
      </div>
      <Badge variant="secondary" className="w-fit">
        Wallet not connected
      </Badge>
    </div>
  )
}
