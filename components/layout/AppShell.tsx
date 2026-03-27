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
    <>
      {/* Embedded responsive CSS — no Tailwind dependency */}
      <style>{`
        .af-sidebar   { display: block; }
        .af-main      { margin-left: 220px; padding: 2rem; min-height: 100vh; }
        .af-inner     { max-width: 1100px; margin: 0 auto; }
        .af-bottomnav { display: none; }

        @media (max-width: 767px) {
          .af-sidebar   { display: none; }
          .af-main      { margin-left: 0; padding: 1rem 0.9rem; padding-bottom: 84px; }
          .af-bottomnav { display: block; }
        }
      `}</style>

      {/* Sidebar (fixed, desktop only) */}
      <div className="af-sidebar">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="af-main">
        <div className="af-inner">
          {children}
        </div>
      </main>

      {/* Bottom nav (mobile only) */}
      <div className="af-bottomnav">
        <BottomNav />
      </div>
    </>
  )
}
