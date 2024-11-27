import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import AdminNavBar from '@/components/admin/admin-nav-bar'
import prisma from '@/lib/prismadb'
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Updated import

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    redirect('/')
  }

  const user = await prisma.usuarios.findUnique({
    where: { email: session.user.email },
    select: { tipo_usuario: true }
  })

  if (!user || user.tipo_usuario !== 1) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavBar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}








