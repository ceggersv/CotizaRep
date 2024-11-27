import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prismadb'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API: /api/seller/responded-quotations called')

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user?.email) {
      console.log('API: Not authenticated')
      return res.status(401).json({ error: 'Not authenticated' })
    }

    console.log('API: Session data', JSON.stringify(session, null, 2))

    const user = await prisma.usuarios.findUnique({
      where: { email: session.user.email },
      select: { usuario_id: true, tipo_usuario: true }
    })

    if (!user) {
      console.log('API: User not found')
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.tipo_usuario !== 2) {
      console.log('API: Not authorized', { userType: user.tipo_usuario })
      return res.status(403).json({ error: 'Not authorized' })
    }

    console.log('API: Fetching responded quotations for user', user.usuario_id)
    const respondedQuotations = await prisma.cotizaciones.findMany({
      where: {
        vendedor_id: user.usuario_id,
        estado: 'Enviada'
      },
      include: {
        solicitud: true
      },
      orderBy: { fecha_creacion: 'desc' }
    })

    console.log('API: Responded quotations fetched', JSON.stringify(respondedQuotations, null, 2))

    if (respondedQuotations.length === 0) {
      console.log('API: No responded quotations found for user', user.usuario_id)
    }

    res.status(200).json(respondedQuotations)
  } catch (error) {
    console.error('API: Error in responded-quotations handler:', error)
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) })
  }
}







