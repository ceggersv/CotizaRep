import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      console.log('Unauthorized: No session or email')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.usuarios.findUnique({
      where: { email: session.user.email },
      select: { usuario_id: true, tipo_usuario: true }
    })

    if (!user || user.tipo_usuario !== 2) {
      console.log('Unauthorized: User not found or not a seller', { user })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, response } = await req.json()

    if (!id || !response) {
      console.log('Bad Request: Missing required fields', { id, response })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const quotationId = parseInt(id)

    if (isNaN(quotationId)) {
      console.log('Bad Request: Invalid quotation ID', { id })
      return NextResponse.json({ error: 'Invalid quotation ID' }, { status: 400 })
    }

    // Check if the quotation exists and is still pending
    const existingQuotation = await prisma.solicitudesCotizacion.findUnique({
      where: { solicitud_id: quotationId, estado: 'Pendiente' }
    })

    if (!existingQuotation) {
      console.log('Not Found: Quotation not found or already responded', { quotationId })
      return NextResponse.json({ error: 'Quotation not found or already responded' }, { status: 404 })
    }

    // Create a new cotizacion
    const newCotizacion = await prisma.cotizaciones.create({
      data: {
        solicitud_id: quotationId,
        vendedor_id: user.usuario_id,
        respuesta: response,
        estado: 'Enviada',
        fecha_creacion: new Date(), // Changed from fecha_cotizacion to fecha_creacion
      },
    })

    // Update the solicitud status
    await prisma.solicitudesCotizacion.update({
      where: { solicitud_id: quotationId },
      data: { estado: 'Respondida' },
    })

    console.log('Response submitted successfully', { newCotizacion })
    return NextResponse.json({ success: true, cotizacion: newCotizacion })
  } catch (error) {
    console.error('Error submitting response:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
