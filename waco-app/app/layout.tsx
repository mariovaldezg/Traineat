import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Waco 70.3 — Mario Training',
  description: 'Plan de entrenamiento Ironman 70.3 Waco 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-6 max-w-5xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
