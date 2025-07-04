import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/providers/AuthProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dream11 Multi Team Creator',
  description: 'Smart fantasy team creation assistant for Dream11 power users',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Dream11 Creator',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Dream11 Multi Team Creator',
    title: 'Dream11 Multi Team Creator',
    description: 'Smart fantasy team creation assistant for Dream11 power users',
  },
  twitter: {
    card: 'summary',
    title: 'Dream11 Multi Team Creator',
    description: 'Smart fantasy team creation assistant for Dream11 power users',
  },
}

export function generateViewport() {
  return {
    themeColor: '#E51C23',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dream11 Creator" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#E51C23" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
