'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, RefreshCw, TrendingUp, Wrench } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/ledger', label: 'Ledger', icon: BookOpen },
  { href: '/subscriptions', label: 'Subs', icon: RefreshCw },
  { href: '/insights', label: 'Insights', icon: TrendingUp },
  { href: '/tools', label: 'Tools', icon: Wrench },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(6,6,19,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom))',
      gap: '0.25rem',
    }}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} style={{ textDecoration: 'none', flex: 1 }}>
            <motion.div
              whileTap={{ scale: 0.88 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0',
                borderRadius: '0.6rem',
                position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 24,
                    height: 3,
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #7c6aff, #06d6a0)',
                  }}
                />
              )}
              <Icon size={20} color={isActive ? '#a897ff' : 'rgba(232,232,240,0.35)'} />
              <span style={{
                fontSize: '0.62rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#a897ff' : 'rgba(232,232,240,0.35)',
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
