'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { data: session } = useSession()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', { 
      email, 
      password,
      redirect: false
    })
    if (result?.error) {
      alert(result.error)
    }
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Welcome, {session.user?.name}</h1>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to CotizaRep</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}