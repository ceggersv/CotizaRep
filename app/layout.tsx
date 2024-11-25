import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CotizaRep',
  description: 'Auto parts quotation system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}











