'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-800">CotizaRep</span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}>
                Dashboard
              </Link>
              <Link href="/dashboard/new-quotation" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/dashboard/new-quotation' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}>
                New Quotation
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Button onClick={handleSignOut} variant="ghost">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

