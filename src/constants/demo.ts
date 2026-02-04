/**
 * Constants for UI Auth & AI Surface
 *
 * Branch: 002-ui-auth-ai-surface
 * Date: 2026-02-04
 *
 * Hardcoded values per Constitution Principle V (Hardcode Aggressively)
 */

import type { Address } from 'viem'
import type { EIP712Domain } from '@/types'

// ============================================================================
// Token Constants
// ============================================================================

/** Sepolia USDC contract address */
export const USDC_ADDRESS: Address = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

/** USDC decimal places */
export const USDC_DECIMALS = 6

/** USDC symbol for display */
export const USDC_SYMBOL = 'USDC'

// ============================================================================
// EIP-712 Configuration
// ============================================================================

/** EIP-712 domain separator for policy signing */
export const EIP712_DOMAIN: EIP712Domain = {
  name: 'Echo Policy Demo',
  version: '1',
  chainId: 11155111, // Sepolia
  verifyingContract: '0x0000000000000000000000000000000000000000' as Address,
}

/** EIP-712 type definitions for Policy struct */
export const EIP712_TYPES = {
  Policy: [
    { name: 'maxAmount', type: 'uint256' },
    { name: 'tokenAddress', type: 'address' },
    { name: 'endpointTag', type: 'string' },
  ],
} as const

// ============================================================================
// Demo Configuration
// ============================================================================

/** Default merchant/endpoint tag */
export const DEMO_MERCHANT = 'demo-merchant'

/** Default recipient label for display */
export const DEMO_RECIPIENT = 'Acme Supplies'

// ============================================================================
// UI Text Constants
// ============================================================================

export const UI_TEXT = {
  /** Authority signing button label */
  signAuthority: 'Sign Authority (No Funds Move)',
  /** Authority signing loading label */
  signingAuthority: 'Signing Authority...',
  /** Authority active indicator */
  authorityActive: 'Authority Defined',
  /** Hero tagline */
  heroTagline: 'Define authority once, AI operates safely without your private keys.',
} as const
