'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface QuotationRequest {
  solicitud_id: number
  marca: string
  modelo: string
  vin: string
  descripcion: string
  fecha_creacion: string
  estado: string
}

export default function BuyerDashboard() {
  const { data: session } = useSession()
  const [quotations, setQuotations] = useState<QuotationRequest[]>([])

  useEffect(() => {
    const fetchQuotations = async () => {
      const response = await fetch('/api/buyer/quotations')
      if (response.ok) {
        const data = await response.json()
        setQuotations(data)
      }
    }

    fetchQuotations()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">My Quotation Requests</h1>
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.solicitud_id}>
              <TableCell>{quotation.solicitud_id}</TableCell>
              <TableCell>{quotation.marca}</TableCell>
              <TableCell>{quotation.modelo}</TableCell>
              <TableCell>{quotation.vin}</TableCell>
              <TableCell>{quotation.descripcion}</TableCell>
              <TableCell>{new Date(quotation.fecha_creacion).toLocaleDateString()}</TableCell>
              <TableCell>{quotation.estado}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

