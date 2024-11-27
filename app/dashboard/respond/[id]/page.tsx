import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import RespondForm from './respond-form'
import prisma from '@/lib/prismadb'

export default async function RespondPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.tipo_usuario !== 2) {
    redirect('/login')
  }

  const id = parseInt(params.id)

  if (isNaN(id)) {
    return <div>Invalid quotation ID</div>
  }

  const quotation = await prisma.solicitudesCotizacion.findUnique({
    where: {
      solicitud_id: id
    }
  })

  if (!quotation) {
    return <div>Quotation not found</div>
  }

  return <RespondForm quotation={quotation} />
}

