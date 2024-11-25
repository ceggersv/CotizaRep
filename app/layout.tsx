import { Providers } from './providers'
import './globals.css'
import { Metadata } from 'next'

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}










