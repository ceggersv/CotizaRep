import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prismadb'
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const user = await prisma.usuarios.findUnique({
    where: { email: session.user.email },
    select: { usuario_id: true, tipo_usuario: true }
  })

  if (!user || user.tipo_usuario !== 3) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  try {
    const quotations = await prisma.solicitudesCotizacion.findMany({
      where: { usuario_id: user.usuario_id },
      orderBy: { fecha_creacion: 'desc' }
    })

    res.status(200).json(quotations)
  } catch (error) {
    console.error('Error fetching quotations:', error)
    res.status(500).json({ error: 'Error fetching quotations' })
  }
}

