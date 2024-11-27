'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardData {
  userCount: number
  quotationCount: number
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({ userCount: 0, quotationCount: 0 })

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await fetch('/api/admin/dashboard-data')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.userCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.quotationCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
