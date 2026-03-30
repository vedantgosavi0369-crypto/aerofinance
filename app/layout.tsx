import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AppShell from '@/components/layout/AppShell'

export const metadata: Metadata = {
  title: 'AeroFinance – Personal Finance',
  description: 'A clean, professional personal finance management application.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#09090B',
              border: '1px solid #E4E4E7',
              borderRadius: '6px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
