import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from '@/lib/prismadb'

async function getDashboardData() {
  const userCount = await prisma.usuarios.count()
  const quotationCount = await prisma.solicitudesCotizacion.count()
  const pendingQuotationCount = await prisma.solicitudesCotizacion.count({
    where: { estado: 'Pendiente' }
  })
  const completedQuotationCount = await prisma.solicitudesCotizacion.count({
    where: { estado: 'Completada' }
  })

  const quotations = await prisma.solicitudesCotizacion.findMany({
    include: {
      usuario: {
        select: {
          nombre: true,
          email: true
        }
      },
      items: true
    },
    orderBy: { fecha_creacion: 'desc' },
    take: 10 // Limit to 10 most recent quotations
  })

  return {
    userCount,
    quotationCount,
    pendingQuotationCount,
    completedQuotationCount,
    quotations
  }
}

export default async function AdminDashboard() {
  const { userCount, quotationCount, pendingQuotationCount, completedQuotationCount, quotations } = await getDashboardData()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotationCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuotationCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedQuotationCount}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Quotations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>VIN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.solicitud_id}>
              <TableCell>{quotation.solicitud_id}</TableCell>
              <TableCell>{quotation.usuario.nombre}</TableCell>
              <TableCell>{quotation.marca}</TableCell>
              <TableCell>{quotation.modelo}</TableCell>
              <TableCell>{quotation.vin}</TableCell>
              <TableCell>{quotation.estado}</TableCell>
              <TableCell>{new Date(quotation.fecha_creacion).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}









