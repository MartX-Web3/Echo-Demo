import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Analytics } from '@vercel/analytics/react'
import { config } from '@/config/wagmi'
import { PolicyProvider, usePolicy } from '@/context/PolicyContext'
import { Layout } from '@/components/Layout'
import { ConnectPage } from '@/pages/ConnectPage'
import { PolicyPage } from '@/pages/PolicyPage'
import { DashboardPage } from '@/pages/DashboardPage'

const queryClient = new QueryClient()

// Route guard: requires wallet connection
function RequireWallet({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

// Route guard: requires signed policy
function RequirePolicy({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()
  const { policy } = usePolicy()

  if (!isConnected) {
    return <Navigate to="/" replace />
  }

  if (!policy) {
    return <Navigate to="/policy" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ConnectPage />} />
        <Route
          path="/policy"
          element={
            <RequireWallet>
              <PolicyPage />
            </RequireWallet>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequirePolicy>
              <DashboardPage />
            </RequirePolicy>
          }
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PolicyProvider>
            <AppRoutes />
          </PolicyProvider>
        </BrowserRouter>
      </QueryClientProvider>
      <Analytics />
    </WagmiProvider>
  )
}

export default App
