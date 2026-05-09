import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import SplashScreen from '@/components/SplashScreen'

export const metadata: Metadata = {
    title: 'Traineat — Mario · Waco 70.3',
    description: 'Traineat — Training & nutrition tracker · Ironman 70.3 Waco 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
          <html lang="es">
                <body className="bg-gray-50 text-gray-900 min-h-screen">
                        <SplashScreen />
                        <div className="flex min-h-screen">
                                  <Sidebar />
                                  <main className="flex-1 ml-64 p-6 max-w-5xl">
                                    {children}
                                  </main>main>
                        </div>div>
                </body>body>
          </html>html>
        )
}</html>
