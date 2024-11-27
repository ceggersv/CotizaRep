'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RespondedQuotation {
  cotizacion_id: number
  solicitud_id: number
  respuesta: string
  fecha_creacion: string
  estado: string
  solicitud: {
    marca: string
    modelo: string
    vin: string
  }
}

export function RespondedQuotations() {
  const { data: session, status } = useSession()
  const [respondedQuotations, setRespondedQuotations] = useState<RespondedQuotation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('RespondedQuotations: Component mounted')
    console.log('Session status:', status)
    console.log('Session data:', session)

    if (status === 'loading') {
      console.log('RespondedQuotations: Session is loading')
      return
    }
    
    if (!session) {
      console.log('RespondedQuotations: No session')
      setIsLoading(false)
      return
    }
    
    if (session.user.tipo_usuario !== 2) {
      console.log('RespondedQuotations: User is not a seller', session.user)
      setIsLoading(false)
      return
    }

    const fetchRespondedQuotations = async () => {
      try {
        console.log('RespondedQuotations: Fetching data')
        const response = await fetch('/api/seller/responded-quotations')
        const data = await response.json()

        console.log('RespondedQuotations: Response status:', response.status)
        console.log('RespondedQuotations: Response data:', data)

        if (response.ok) {
          console.log('RespondedQuotations: Data received', data)
          setRespondedQuotations(data)
        } else {
          console.error('Failed to fetch responded quotations:', data.error)
          setError(`Failed to fetch responded quotations: ${data.error}`)
        }
      } catch (error) {
        console.error('Error fetching responded quotations:', error)
        setError(`Error fetching responded quotations: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRespondedQuotations()
  }, [session, status])

  console.log('RespondedQuotations: Render', { isLoading, error, quotationsCount: respondedQuotations.length })

  if (isLoading) {
    return <div>Loading responded quotations...</div>
  }

  if (error) {
    return (
      <div className="mt-10 p-4 bg-red-100 text-red-700 rounded">
        <h2 className="text-xl font-semibold mb-2">Error in Responded Quotations:</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!session || session.user.tipo_usuario !== 2) {
    return <div>You are not authorized to view this content.</div>
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Responded Quotations</h2>
      {respondedQuotations.length === 0 ? (
        <p>No responded quotations available.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {respondedQuotations.map((quotation) => (
              <TableRow key={quotation.cotizacion_id}>
                <TableCell>{quotation.cotizacion_id}</TableCell>
                <TableCell>{quotation.solicitud.marca}</TableCell>
                <TableCell>{quotation.solicitud.modelo}</TableCell>
                <TableCell>{quotation.solicitud.vin}</TableCell>
                <TableCell>{quotation.respuesta}</TableCell>
                <TableCell>{new Date(quotation.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell>{quotation.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

