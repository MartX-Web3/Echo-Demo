import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAccount } from 'wagmi'
import type { SignedPolicy } from '@/types'

const STORAGE_KEY = 'echo_demo_policy'

interface PolicyContextValue {
  policy: SignedPolicy | null
  setPolicy: (policy: SignedPolicy) => void
  clearPolicy: () => void
}

const PolicyContext = createContext<PolicyContextValue | null>(null)

function loadStoredPolicy(): SignedPolicy | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as SignedPolicy
    }
  } catch {
    // Invalid stored data, ignore
  }
  return null
}

export function PolicyProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const [policy, setPolicyState] = useState<SignedPolicy | null>(loadStoredPolicy)

  // Sync policy to localStorage when it changes
  useEffect(() => {
    if (policy) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(policy))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [policy])

  // Clear policy when wallet disconnects or address changes
  // This effect intentionally syncs React state with external wallet state changes
  useEffect(() => {
    if (!isConnected && policy) {
      // Use a microtask to avoid synchronous cascading renders
      queueMicrotask(() => setPolicyState(null))
    } else if (policy && address && policy.signerAddress !== address) {
      // Address changed - clear policy from different signer
      queueMicrotask(() => setPolicyState(null))
    }
  }, [isConnected, address, policy])

  const setPolicy = useCallback((newPolicy: SignedPolicy) => {
    setPolicyState(newPolicy)
  }, [])

  const clearPolicy = useCallback(() => {
    setPolicyState(null)
  }, [])

  return (
    <PolicyContext.Provider value={{ policy, setPolicy, clearPolicy }}>
      {children}
    </PolicyContext.Provider>
  )
}

export function usePolicy() {
  const context = useContext(PolicyContext)
  if (!context) {
    throw new Error('usePolicy must be used within a PolicyProvider')
  }
  return context
}
