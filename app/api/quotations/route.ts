import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.tipo_usuario !== 2) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const quotations = await prisma.solicitudesCotizacion.findMany({
      where: {
        estado: 'PENDIENTE'
      }
    })
    return NextResponse.json(quotations)
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

