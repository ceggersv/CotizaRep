import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SellerDashboard } from "@/components/seller-dashboard"
import { CustomerDashboard } from "@/components/customer-dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {session.user.tipo_usuario === 2 ? (
        <SellerDashboard />
      ) : session.user.tipo_usuario === 3 ? (
        <CustomerDashboard />
      ) : (
        <p>Unauthorized access</p>
      )}
    </div>
  )
}

