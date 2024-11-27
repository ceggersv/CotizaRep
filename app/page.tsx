import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome to CotizaRep</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Your one-stop solution for vehicle spare parts quotations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-gray-600">
              CotizaRep connects vehicle owners with spare parts sellers, 
              streamlining the process of requesting and receiving quotations 
              for the parts you need.
            </p>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register/seller">Register as Seller</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register/customer">Register as Customer</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

