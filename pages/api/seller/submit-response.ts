import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prismadb'
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const user = await prisma.usuarios.findUnique({
    where: { email: session.user.email },
    select: { usuario_id: true, tipo_usuario: true }
  })

  if (!user || user.tipo_usuario !== 2) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  try {
    const { solicitud_id, respuesta } = req.body

    // Create a new cotizacion
    const newCotizacion = await prisma.cotizaciones.create({
      data: {
        solicitud_id: solicitud_id,
        vendedor_id: user.usuario_id,
        respuesta: respuesta,
        estado: 'Enviada',
      },
    })

    // Update the solicitud status
    await prisma.solicitudesCotizacion.update({
      where: { solicitud_id: solicitud_id },
      data: { estado: 'Respondida' },
    })

    res.status(201).json(newCotizacion)
  } catch (error) {
    console.error('Error submitting response:', error)
    res.status(500).json({ error: 'Error submitting response' })
  }
}

