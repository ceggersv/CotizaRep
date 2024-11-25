'use client'

import { Providers } from '@/app/providers'
import LoginForm from '@/components/login-form'
import ErrorBoundary from '@/components/error-boundary'

export default function ClientWrapper() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try refreshing the page.</div>}>
      <Providers>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <LoginForm />
        </main>
      </Providers>
    </ErrorBoundary>
  )
}


