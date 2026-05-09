import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
          title: 'Traineat',
          description: 'Ironman 70.3 Waco 2026',
          icons: {
                      icon: '/logo.png',
                      apple: '/logo.png',
          },
          manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
          return (
                      <html lang="es">
                            <head>
                                    <link rel="apple-touch-icon" href="/logo.png" />
                                    <meta name="apple-mobile-web-app-capable" content="yes" />
                                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                                    <meta name="apple-mobile-web-app-title" content="Traineat" />
                            </head>head>
                            <body className="bg-gray-50 text-gray-900 min-h-screen">
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
