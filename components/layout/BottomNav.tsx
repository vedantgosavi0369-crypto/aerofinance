'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, RefreshCw, TrendingUp, Wrench } from 'lucide-react'

const navItems = [
  { href: '/dashboard',     label: 'Home',     icon: LayoutDashboard },
  { href: '/ledger',        label: 'Ledger',   icon: BookOpen },
  { href: '/subscriptions', label: 'Subs',     icon: RefreshCw },
  { href: '/insights',      label: 'Insights', icon: TrendingUp },
  { href: '/tools',         label: 'Tools',    icon: Wrench },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 12,
      left: 12,
      right: 12,
      zIndex: 100,
      background: 'rgba(15,10,30,0.6)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: '24px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.6rem 0.5rem calc(0.6rem + env(safe-area-inset-bottom))',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
    }}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} style={{ textDecoration: 'none', flex: 1 }}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                padding: '0.4rem 0', position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-pill"
                  style={{
                    position: 'absolute',
                    inset: '-4px -8px',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    borderRadius: '16px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon size={20} color={isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)'} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                position: 'relative', zIndex: 1,
              }}>
                {label}
              </span>
            </motion.div>
          </Link>
        )
      })}
    </nav>
  )
}
