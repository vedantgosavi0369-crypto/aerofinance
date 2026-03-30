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
      background: '#000000',
      borderTop: '4px solid #FFFFFF',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.75rem 0 calc(0.75rem + env(safe-area-inset-bottom))',
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
                borderRadius: '0',
                position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  style={{
                    position: 'absolute',
                    top: -12, /* aligns with the very top of the bar */
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    height: 4,
                    background: '#00E676',
                  }}
                />
              )}
              <Icon size={22} color={isActive ? '#00E676' : '#FFFFFF'} strokeWidth={isActive ? 3 : 2} />
              <span style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#00E676' : '#FFFFFF',
                textTransform: 'uppercase',
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
