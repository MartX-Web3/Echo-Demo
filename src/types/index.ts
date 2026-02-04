/**
 * TypeScript Interface Contracts for UI Auth & AI Surface
 *
 * Branch: 002-ui-auth-ai-surface
 * Date: 2026-02-04
 *
 * These interfaces define the data contracts for the frontend implementation.
 * No API endpoints are defined as this feature is frontend-only.
 */

import type { Address, Hex } from 'viem'

// ============================================================================
// Policy Types
// ============================================================================

/**
 * Raw policy data before signing
 */
export interface Policy {
  /** Maximum allowed transaction amount in USDC (human-readable, not wei) */
  maxAmount: number
  /** ERC-20 token address (hardcoded to USDC) */
  tokenAddress: Address
  /** Merchant/recipient identifier tag */
  endpointTag: string
}

/**
 * Policy with cryptographic signature
 */
export interface SignedPolicy extends Policy {
  /** User's EIP-712 signature */
  signature: Hex
  /** EIP-712 typed data hash */
  policyHash: Hex
  /** Address that signed the policy */
  signerAddress: Address
}


// ============================================================================
// EIP-712 Types (for wagmi signTypedData)
// ============================================================================

/**
 * EIP-712 domain separator
 */
export interface EIP712Domain {
  name: string
  version: string
  chainId: number
  verifyingContract: Address
}

/**
 * EIP-712 policy message (values for signing)
 */
export interface EIP712PolicyMessage {
  /** Max amount in wei (bigint for Solidity uint256) */
  maxAmount: bigint
  /** Token contract address */
  tokenAddress: Address
  /** Endpoint identifier */
  endpointTag: string
}

