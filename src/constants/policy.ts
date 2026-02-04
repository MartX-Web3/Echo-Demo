/**
 * Policy configuration constants for the demo
 */

export interface IntentType {
  id: string
  label: string
  description: string
  enabled: boolean
}

export interface Endpoint {
  id: string
  label: string
  uri: string
  category: string
  pricingHint: string
}

// Allowed intent types (operations)
export const INTENT_TYPES: IntentType[] = [
  {
    id: 'sentiment.fetch',
    label: 'sentiment.fetch',
    description: 'Query market sentiment data from analytics services',
    enabled: true,
  },
  {
    id: 'auction.bid',
    label: 'auction.bid',
    description: 'Place bids in agent-to-agent auctions',
    enabled: true,
  },
  {
    id: 'nft.mint',
    label: 'nft.mint',
    description: 'Mint tokens via x402-protected minting services',
    enabled: true,
  },
  {
    id: 'custom.analytics',
    label: 'custom.analytics',
    description: 'Access custom analytics and data processing',
    enabled: true,
  },
  {
    id: 'treasury.transfer',
    label: 'treasury.transfer',
    description: 'Direct treasury transfers (not allowed)',
    enabled: false,
  },
  {
    id: 'arbitrary.payment',
    label: 'arbitrary.payment',
    description: 'Arbitrary payments to any address (not allowed)',
    enabled: false,
  },
  {
    id: 'wallet.withdraw',
    label: 'wallet.withdraw',
    description: 'Withdraw funds from wallet (not allowed)',
    enabled: false,
  },
]

// Whitelisted x402 endpoints
export const X402_ENDPOINTS: Endpoint[] = [
  {
    id: 'genvox-sentiment',
    label: 'Crypto Sentiment API',
    uri: 'https://api.genvox.io/v1/sentiment/BTC',
    category: 'Market Data / Analytics',
    pricingHint: '0.03 USDC/query',
  },
  {
    id: 'auction-bid',
    label: 'x402 Auction Bid',
    uri: 'https://api.yourdemo.com/auction/bid',
    category: 'Auction / Agent Economy',
    pricingHint: 'Variable bid price',
  },
  {
    id: 'nft-mint',
    label: 'NFT Mint Service',
    uri: 'https://x402scan.com/server/mint-small',
    category: 'Minting / Token Services',
    pricingHint: '0.50 USDC/mint',
  },
  {
    id: 'asterpay-settle',
    label: 'AsterPay Settlement Relay',
    uri: 'https://asterpay.xyz/api/settle',
    category: 'Fiat off-ramp / Settlement',
    pricingHint: '0.10 USDC + 0.5%',
  },
]

// Default execution constraints
export const DEFAULT_CONSTRAINTS = {
  maxActionsPerHour: 3,
  maxActionsPerDay: 10,
  maxConcurrent: 1,
}

// Default financial limits
export const DEFAULT_LIMITS = {
  maxPerAction: 50,
  maxDailySpend: 120,
}

// Policy validity (demo dates)
export const DEFAULT_VALIDITY = {
  validFrom: '2026-02-01',
  validUntil: '2026-02-28',
}
