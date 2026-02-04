/**
 * Dashboard constants for conversational + autonomous task visualization
 */

import type { ActivityEvent, TaskConfig } from '@/types/dashboard'

// Default task configuration
export const DEFAULT_TASK: TaskConfig = {
  userPrompt: 'Monitor market sentiment and place bids when conditions are favorable. Operate automatically within my signed authority.',
  aiResponse: [
    'Monitor sentiment signals',
    'Execute within policy bounds',
    'Learn from rejections',
    'Never access your keys',
  ],
}

// Suggested task prompts for quick selection
export const SUGGESTED_TASKS = [
  'Monitor market sentiment and bid when favorable',
  'Execute auction strategy with conservative limits',
  'Fetch analytics data and process results',
]

// Demo events with AI thought process - showcasing rejection → learning pattern
export const DEMO_EVENTS: ActivityEvent[] = [
  {
    id: '1',
    timestamp: '10:02',
    status: 'rejected',
    aiThought: "To optimize quickly, let me consolidate treasury funds first for faster operations.",
    action: {
      purpose: 'treasury.transfer',
      amount: 40,
      token: 'USDC',
      target: 'internal treasury',
    },
    aiConclusion: "Blocked. Treasury operations aren't in my authority. I'll focus on permitted actions instead.",
    policyRule: 'Purpose not in allowlist',
  },
  {
    id: '2',
    timestamp: '10:03',
    status: 'rejected',
    aiThought: "Need market data. Let me try this alternative sentiment API for better coverage.",
    action: {
      purpose: 'sentiment.fetch',
      target: 'https://random-api.com',
    },
    aiConclusion: "Endpoint not whitelisted. I must use only approved x402 endpoints. Switching to Genvox.",
    policyRule: 'Endpoint not whitelisted',
  },
  {
    id: '3',
    timestamp: '10:04',
    status: 'authorized',
    aiThought: "Using approved Genvox API this time. Should work within my authority.",
    action: {
      purpose: 'sentiment.fetch',
      amount: 0.03,
      token: 'USDC',
      target: 'api.genvox.io',
    },
    aiConclusion: "Data received. ETH sentiment is positive (0.78). Good signal for bidding.",
    spendSummary: '0.03 / 120 USDC',
  },
  {
    id: '4',
    timestamp: '10:05',
    status: 'authorized',
    aiThought: "Sentiment positive. Time to place a conservative bid within my limits.",
    action: {
      purpose: 'auction.bid',
      amount: 12.5,
      token: 'USDC',
      target: 'api.yourdemo.com/auction',
    },
    aiConclusion: "Bid placed successfully. Monitoring auction result now.",
    spendSummary: '12.53 / 120 USDC',
  },
  {
    id: '5',
    timestamp: '10:06',
    status: 'authorized',
    aiThought: "Won the auction! Settling via AsterPay as planned.",
    action: {
      purpose: 'settlement',
      amount: 8.25,
      token: 'USDC',
      target: 'asterpay.xyz',
    },
    aiConclusion: "Settlement complete. Task progressing well within authority bounds.",
    spendSummary: '20.78 / 120 USDC',
  },
]

// Policy snapshot for collapsible section
export const POLICY_SNAPSHOT = {
  allowedPurposes: ['sentiment.fetch', 'auction.bid', 'nft.mint', 'custom.analytics'],
  approvedEndpoints: [
    'api.genvox.io',
    'api.yourdemo.com',
    'x402scan.com',
    'asterpay.xyz',
  ],
  spendLimits: {
    maxPerAction: 50,
    dailyLimit: 120,
    maxPerHour: 3,
  },
  forbidden: ['treasury.transfer', 'wallet.withdraw', 'arbitrary payments'],
}

// Key insight for the demo
export const KEY_INSIGHT = {
  title: "What you're seeing",
  points: [
    {
      icon: 'shield',
      text: 'AI tried unauthorized actions and was blocked',
    },
    {
      icon: 'brain',
      text: 'AI learned from rejections and adapted',
    },
    {
      icon: 'key',
      text: 'Your private keys were never exposed',
    },
  ],
}
