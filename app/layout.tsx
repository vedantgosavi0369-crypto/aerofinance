import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AppShell from '@/components/layout/AppShell'

export const metadata: Metadata = {
  title: 'AeroFinance – Liquid Glass Finance',
  description: 'Premium personal finance app with liquid glass design.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0d0d2b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {/* Animated background orbs */}
        <div className="orb" style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(91,155,255,0.6) 0%, transparent 70%)', top: '-200px', left: '-150px', animationDelay: '0s' }} />
        <div className="orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(167,139,250,0.5) 0%, transparent 70%)', top: '-100px', right: '-200px', animationDelay: '-5s', animationDuration: '22s' }} />
        <div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(52,216,235,0.45) 0%, transparent 70%)', bottom: '10%', left: '20%', animationDelay: '-10s', animationDuration: '25s' }} />
        <div className="orb" style={{ width: 450, height: 450, background: 'radial-gradient(circle, rgba(74,222,128,0.35) 0%, transparent 70%)', bottom: '-100px', right: '10%', animationDelay: '-15s', animationDuration: '30s' }} />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '14px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            },
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
