'use client'

import React, { useEffect, useState } from 'react'
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface OpenQuotation {
  solicitud_id: number
  marca: string
  modelo: string
  vin: string
  descripcion: string
  fecha_creacion: string
}

export function OpenQuotationRequests() {
  const { data: session, status } = useSession()
  const [openQuotations, setOpenQuotations] = useState<OpenQuotation[]>([])
  const [responses, setResponses] = useState<{ [key: number]: string }>({})
  const [activeQuotation, setActiveQuotation] = useState<number | null>(null)

  useEffect(() => {
    console.log('OpenQuotationRequests: Component mounted or updated')
    if (status === 'loading' || !session || session.user.tipo_usuario !== 2) return

    const fetchOpenQuotations = async () => {
      try {
        const response = await fetch('/api/seller/open-quotations')
        if (response.ok) {
          const data = await response.json()
          console.log('OpenQuotationRequests: Data received', data)
          setOpenQuotations(data)
        } else {
          console.error('Failed to fetch open quotations:', await response.text())
        }
      } catch (error) {
        console.error('Error fetching open quotations:', error)
      }
    }

    fetchOpenQuotations()
  }, [session, status])

  const handleResponseChange = (solicitud_id: number, value: string) => {
    setResponses(prev => ({ ...prev, [solicitud_id]: value }))
  }

  const handleSubmitResponse = async (solicitud_id: number) => {
    if (!session) return

    try {
      const response = await fetch('/api/seller/submit-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solicitud_id,
          respuesta: responses[solicitud_id],
        }),
      })

      if (response.ok) {
        toast({
          title: "Response submitted successfully",
          description: "Your quotation has been sent to the customer.",
        })
        setOpenQuotations(prev => prev.filter(q => q.solicitud_id !== solicitud_id))
        setResponses(prev => {
          const newResponses = { ...prev }
          delete newResponses[solicitud_id]
          return newResponses
        })
        setActiveQuotation(null)
      } else {
        throw new Error(await response.text())
      }
    } catch (error) {
      console.error('Error submitting response:', error)
      toast({
        title: "Error",
        description: "There was a problem submitting your response.",
        variant: "destructive",
      })
    }
  }

  const handleCancelResponse = (solicitud_id: number) => {
    setResponses(prev => {
      const newResponses = { ...prev }
      delete newResponses[solicitud_id]
      return newResponses
    })
    setActiveQuotation(null)
  }

  if (status === 'loading' || !session || session.user.tipo_usuario !== 2) {
    return null
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Open Quotation Requests 2</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>VIN</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {openQuotations.map((quotation) => (
            <React.Fragment key={quotation.solicitud_id}>
              <TableRow>
                <TableCell>{quotation.solicitud_id}</TableCell>
                <TableCell>{quotation.marca}</TableCell>
                <TableCell>{quotation.modelo}</TableCell>
                <TableCell>{quotation.vin}</TableCell>
                <TableCell>{quotation.descripcion}</TableCell>
                <TableCell>{new Date(quotation.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell>
                  {activeQuotation === quotation.solicitud_id ? (
                    <Button variant="outline" size="sm" onClick={() => setActiveQuotation(null)}>
                      Cancel
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setActiveQuotation(quotation.solicitud_id)}>
                      Respond
                    </Button>
                  )}
                </TableCell>
              </TableRow>
              {activeQuotation === quotation.solicitud_id && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="mt-4">
                      <Textarea
                        placeholder="Enter your response"
                        value={responses[quotation.solicitud_id] || ''}
                        onChange={(e) => handleResponseChange(quotation.solicitud_id, e.target.value)}
                        rows={4}
                        className="w-full mb-2"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelResponse(quotation.solicitud_id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSubmitResponse(quotation.solicitud_id)}
                          disabled={!responses[quotation.solicitud_id]}
                        >
                          Submit Response
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

