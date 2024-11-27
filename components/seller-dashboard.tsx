'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OpenQuotationRequests } from './open-quotation-requests'
import { RespondedQuotations } from './responded-quotations'
import ErrorBoundary from './error-boundary'

interface Quotation {
  id: number
  marca: string
  modelo: string
  vin: string
  descripcion: string
  fecha_creacion: string
  estado: string
}

export function SellerDashboard() {
  const { data: session, status } = useSession()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('SellerDashboard: Component mounted')
    console.log('Session status:', status)
    console.log('Session data:', session)

    if (status === 'loading' || !session || session.user.tipo_usuario !== 2) return

    const fetchQuotations = async () => {
      try {
        console.log('SellerDashboard: Fetching quotations')
        const response = await fetch('/api/seller/quotations')
        if (response.ok) {
          const data = await response.json()
          console.log('SellerDashboard: Quotations received', data)
          setQuotations(data)
        } else {
          const errorText = await response.text()
          console.error('Failed to fetch quotations:', errorText)
          setError(`Failed to fetch quotations: ${errorText}`)
        }
      } catch (error) {
        console.error('Error fetching quotations:', error)
        setError(`Error fetching quotations: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    fetchQuotations()
  }, [session, status])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.tipo_usuario !== 2) {
    return <div>Unauthorized access</div>
  }

  return (
    <ErrorBoundary>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Quotations</h2>
        
        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded">
            <h3 className="text-xl font-semibold mb-2">Error:</h3>
            <p>{error}</p>
          </div>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((quotation) => (
              <TableRow key={quotation.id}>
                <TableCell>{quotation.id}</TableCell>
                <TableCell>{quotation.marca}</TableCell>
                <TableCell>{quotation.modelo}</TableCell>
                <TableCell>{quotation.vin}</TableCell>
                <TableCell>{quotation.descripcion}</TableCell>
                <TableCell>{new Date(quotation.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell>{quotation.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ErrorBoundary>
          <OpenQuotationRequests />
        </ErrorBoundary>

        <ErrorBoundary>
          <RespondedQuotations />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  )
}



