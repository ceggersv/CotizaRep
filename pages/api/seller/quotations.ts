import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session || session.user.tipo_usuario !== 2) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const quotations = await prisma.cotizaciones.findMany({
        where: {
          vendedor_id: session.user.id
        },
        include: {
          solicitud_cotizacion: true
        }
      })

      res.status(200).json(quotations)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quotations' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

