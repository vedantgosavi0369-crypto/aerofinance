'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { useFinanceStore } from '@/store/useFinanceStore'

const AUTH_PAGES = ['/login', '/auth']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const loadAll = useFinanceStore((s) => s.loadAll)

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p))

  useEffect(() => {
    if (!isAuthPage) {
      loadAll()
    }
  }, [isAuthPage, loadAll])

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Desktop Sidebar — hidden on mobile */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Nav — visible only on mobile */}
      <div className="mobile-bottom-nav">
        <BottomNav />
      </div>
    </div>
  )
}
