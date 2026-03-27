'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  RefreshCw,
  TrendingUp,
  Wrench,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react'
import { useFinanceStore } from '@/store/useFinanceStore'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ledger', label: 'Ledger', icon: BookOpen },
  { href: '/subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { href: '/insights', label: 'Insights', icon: TrendingUp },
  { href: '/tools', label: 'Tools', icon: Wrench },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { privacyMode, togglePrivacyMode } = useFinanceStore()

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: 'rgba(6,6,19,0.8)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c6aff, #06d6a0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e8e8f0' }}>AeroFinance</span>
        </div>
      </Link>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.75rem',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(124,106,255,0.2), rgba(6,214,160,0.1))'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(124,106,255,0.25)' : '1px solid transparent',
                  color: isActive ? '#a897ff' : 'rgba(232,232,240,0.5)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={17} />
                {label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Privacy Mode Toggle */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={togglePrivacyMode}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.65rem 0.85rem',
          borderRadius: '0.75rem',
          background: privacyMode ? 'rgba(255,107,151,0.1)' : 'rgba(255,255,255,0.04)',
          border: privacyMode ? '1px solid rgba(255,107,151,0.25)' : '1px solid rgba(255,255,255,0.08)',
          color: privacyMode ? '#ff6b97' : 'rgba(232,232,240,0.5)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 500,
          width: '100%',
          justifyContent: 'flex-start',
        }}
      >
        {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
        {privacyMode ? 'Privacy On' : 'Privacy Mode'}
      </motion.button>
    </aside>
  )
}
