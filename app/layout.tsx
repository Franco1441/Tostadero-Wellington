import type { Metadata, Viewport } from 'next'
import { Inter, Caveat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { STORE_INFO } from '@/lib/store-info'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

const caveat = Caveat({ 
  subsets: ["latin"],
  variable: '--font-serif'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0c4ca1',
}

export const metadata: Metadata = {
  title: `${STORE_INFO.name} · Pedidos online`,
  description: STORE_INFO.description,
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-tostadero.jpg', type: 'image/jpeg' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR">
      <body className={`${inter.variable} ${caveat.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
