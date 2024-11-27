'use client'

import { useSession } from 'next-auth/react'
import NavBar from './nav-bar'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Dashboard</h1>
          <p className="text-xl text-gray-700">Hello, {session?.user?.name || 'User'}!</p>
        </div>
      </main>
    </div>
  )
}

