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

async function getUsers() {
  const users = await prisma.usuarios.findMany({
    select: {
      usuario_id: true,
      nombre: true,
      email: true,
      tipo_usuario: true,
    }
  })

  const userTypes = await prisma.tiposUsuarios.findMany()
  const userTypeMap = Object.fromEntries(userTypes.map(type => [type.id, type.nombre]))

  return users.map(user => ({
    ...user,
    roleName: userTypeMap[user.tipo_usuario] || 'Unknown'
  }))
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.usuario_id}>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roleName}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}





