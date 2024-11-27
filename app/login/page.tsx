import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LoginForm from '@/components/login-form'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return <LoginForm />
}


