import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BluePulse 3D - Ocean Data Visualization',
  description: 'A stunning 3D visualization of ocean temperature data on an interactive globe',
  keywords: ['ocean', 'data visualization', '3D', 'globe', 'temperature', 'climate'],
  authors: [{ name: 'BluePulse Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
