'use client'

import { useEffect, useState } from 'react'
import LoginForm from '@/components/login-form'
import ErrorBoundary from '@/components/error-boundary'
import { SessionProvider } from "next-auth/react"

export default function ClientWrapper() {
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
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <LoginForm />
        </main>
      </ErrorBoundary>
    </SessionProvider>
  )
}

