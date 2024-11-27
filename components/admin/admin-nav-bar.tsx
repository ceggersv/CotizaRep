'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"

export default function AdminNavBar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-800">CotizaRep Admin</span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/admin" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/admin' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}>
                Dashboard
              </Link>
              <Link href="/admin/users" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/admin/users' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}>
                Users
              </Link>
              <Link href="/admin/quotations" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/admin/quotations' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}>
                Quotations
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Button onClick={() => signOut()} variant="ghost">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}





