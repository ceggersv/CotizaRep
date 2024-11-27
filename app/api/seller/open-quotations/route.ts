import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prismadb'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  console.log('API: /api/seller/open-quotations called')

  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    console.log('API: Not authenticated')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = await prisma.usuarios.findUnique({
    where: { email: session.user.email },
    select: { usuario_id: true, tipo_usuario: true }
  })

  if (!user || user.tipo_usuario !== 2) {
    console.log('API: Not authorized')
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  try {
    const openQuotations = await prisma.solicitudesCotizacion.findMany({
      where: { estado: 'Pendiente' },
      orderBy: { fecha_creacion: 'desc' }
    })

    console.log('API: Open quotations fetched', openQuotations)
    return NextResponse.json(openQuotations)
  } catch (error) {
    console.error('Error fetching open quotations:', error)
    return NextResponse.json({ error: 'Error fetching open quotations' }, { status: 500 })
  }
}

