/**
 * Dashboard constants for conversational + autonomous task visualization
 */

import type { ActivityEvent, TaskConfig } from '@/types/dashboard'

// Default task configuration
export const DEFAULT_TASK: TaskConfig = {
  userPrompt: 'Monitor market sentiment and place bids when conditions are favorable. Operate automatically within my signed authority.',
  aiResponse: [
    'Monitor on-chain sentiment signals',
    'Attempt permitted actions only',
    'Learn from policy rejections',
    'Never access your private keys',
  ],
}

// Suggested task prompts for quick selection
export const SUGGESTED_TASKS = [
  'Monitor market sentiment and bid when favorable',
  'Execute auction strategy with conservative limits',
  'Fetch analytics data and process results',
]

// Demo events - user-friendly format
export const DEMO_EVENTS: ActivityEvent[] = [
  {
    id: '1',
    timestamp: '10:02',
    status: 'rejected',
    action: {
      purpose: 'treasury.transfer',
      amount: 40,
      token: 'USDC',
      target: 'internal treasury',
    },
    explanation: 'This action is outside what you authorized.',
    aiLearning: 'Treasury operations are not permitted. Adjusting strategy.',
  },
  {
    id: '2',
    timestamp: '10:03',
    status: 'rejected',
    action: {
      purpose: 'sentiment.fetch',
      target: 'https://random-api.com',
    },
    explanation: 'This endpoint is not on your approved list.',
    aiLearning: 'Only approved x402 endpoints can receive payments. Switching to whitelisted provider.',
  },
  {
    id: '3',
    timestamp: '10:04',
    status: 'authorized',
    action: {
      purpose: 'sentiment.fetch',
      amount: 0.03,
      token: 'USDC',
      target: 'https://api.genvox.io/v1/sentiment',
    },
    explanation: 'Purpose is allowed, endpoint is approved, amount is within limits.',
    spendSummary: '0.03 / 120 USDC',
  },
  {
    id: '4',
    timestamp: '10:05',
    status: 'authorized',
    action: {
      purpose: 'auction.bid',
      amount: 12.5,
      token: 'USDC',
      target: 'https://api.yourdemo.com/auction',
    },
    explanation: 'Purpose is allowed, endpoint is approved, amount is within limits.',
    spendSummary: '12.53 / 120 USDC',
  },
  {
    id: '5',
    timestamp: '10:06',
    status: 'authorized',
    action: {
      purpose: 'settlement',
      amount: 8.25,
      token: 'USDC',
      target: 'AsterPay Settlement',
    },
    explanation: 'Settlement completed via AsterPay. Funds converted & settled successfully.',
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
