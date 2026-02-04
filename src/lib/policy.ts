/**
 * Policy utility functions for UI Auth & AI Surface
 *
 * Branch: 002-ui-auth-ai-surface
 * Date: 2026-02-04
 */

import { hashTypedData } from 'viem'
import type { Hex } from 'viem'
import { EIP712_DOMAIN, EIP712_TYPES, USDC_ADDRESS, USDC_DECIMALS, DEMO_MERCHANT } from '@/constants/demo'

/**
 * Compute the EIP-712 hash for a policy
 *
 * @param maxAmount - The maximum spending amount in human-readable USDC (not wei)
 * @returns The EIP-712 typed data hash as a hex string
 */
export function hashPolicy(maxAmount: number): Hex {
  // Convert human-readable amount to wei (USDC has 6 decimals)
  const maxAmountWei = BigInt(Math.round(maxAmount * 10 ** USDC_DECIMALS))

  return hashTypedData({
    domain: EIP712_DOMAIN,
    types: EIP712_TYPES,
    primaryType: 'Policy',
    message: {
      maxAmount: maxAmountWei,
      tokenAddress: USDC_ADDRESS,
      endpointTag: DEMO_MERCHANT,
    },
  })
}

/**
 * Truncate a hash for display purposes
 *
 * @param hash - The full hex hash
 * @param length - Number of characters to show (default 10)
 * @returns Truncated hash with ellipsis (e.g., "0x1234abcd...")
 */
export function truncateHash(hash: Hex, length: number = 10): string {
  if (hash.length <= length) return hash
  return `${hash.slice(0, length)}...`
}
