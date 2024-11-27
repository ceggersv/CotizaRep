import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import prisma from '@/lib/prismadb'

async function getQuotations() {
  return await prisma.cotizaciones.findMany({
    select: {
      cotizacion_id: true,
      fecha_solicitud: true,
      estado: true,
      comprador: {
        select: { nombre: true }
      },
      vendedor: {
        select: { nombre: true }
      }
    },
    orderBy: { fecha_solicitud: 'desc' }
  })
}

export default async function QuotationsPage() {
  const quotations = await getQuotations()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quotation Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.cotizacion_id}>
              <TableCell>{quotation.cotizacion_id}</TableCell>
              <TableCell>{quotation.comprador.nombre}</TableCell>
              <TableCell>{quotation.vendedor?.nombre || 'Not assigned'}</TableCell>
              <TableCell>{quotation.estado}</TableCell>
              <TableCell>{quotation.fecha_solicitud.toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">View</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

