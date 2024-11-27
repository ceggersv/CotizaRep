'use client'

import { useEffect, useState } from 'react'
import { SessionProvider } from "next-auth/react"
import ErrorBoundary from '@/components/error-boundary'
import Dashboard from '@/components/dashboard'

export default function DashboardWrapper() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // or a loading indicator
  }

  return (
    <SessionProvider>
      <ErrorBoundary fallback={<div>Something went wrong. Please try refreshing the page.</div>}>
        <Dashboard />
      </ErrorBoundary>
    </SessionProvider>
  )
}

