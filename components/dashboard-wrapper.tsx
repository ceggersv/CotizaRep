'use client'

import dynamic from 'next/dynamic'
import { Providers } from '@/app/providers'
import ErrorBoundary from '@/components/error-boundary'

const DynamicDashboard = dynamic(() => import('@/components/dashboard'), {
  ssr: false,
})

export default function DashboardWrapper() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try refreshing the page.</div>}>
      <Providers>
        <DynamicDashboard />
      </Providers>
    </ErrorBoundary>
  )
}


