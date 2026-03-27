import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import { Toaster } from 'react-hot-toast'
import DataLoader from '@/components/DataLoader'

export const metadata: Metadata = {
  title: 'AeroFinance – Weightless Money Management',
  description: 'Premium personal finance app with glassmorphism design',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Ambient orbs */}
        <div className="orb" style={{ width: 600, height: 600, background: '#7c6aff', top: -200, left: -100 }} />
        <div className="orb" style={{ width: 500, height: 500, background: '#06d6a0', bottom: -150, right: -100 }} />
        <div className="orb" style={{ width: 350, height: 350, background: '#ff6b97', top: '50%', left: '40%' }} />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(13,13,31,0.95)',
              color: '#e8e8f0',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.75rem',
              fontFamily: 'Outfit, sans-serif',
            },
          }}
        />
        <DataLoader />

        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <Sidebar />
          <main style={{ marginLeft: '220px', flex: 1, padding: '2rem', minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
