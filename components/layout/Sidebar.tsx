'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, RefreshCw, TrendingUp, Wrench,
  Eye, EyeOff, Zap, LogOut, ChevronDown
} from 'lucide-react'
import { useFinanceStore } from '@/store/useFinanceStore'
import { useUser } from '@/hooks/useUser'
import { useState } from 'react'
import ConnectWallet from '@/components/ConnectWallet'

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
  const { user, signOut } = useUser()
  const [showUser, setShowUser] = useState(false)

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1.25rem',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#FFF" fill="#FFF" />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>AeroFinance</span>
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  background: isActive ? 'var(--bg-secondary)' : 'transparent',
                  borderRadius: '6px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} color={isActive ? 'var(--text-primary)' : 'var(--text-secondary)'} />
                {label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Connect Wallet */}
      <div style={{ marginBottom: '1rem' }}>
        <ConnectWallet />
      </div>

      {/* Privacy Mode */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={togglePrivacyMode}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.65rem 0.85rem', marginBottom: '1rem',
          background: privacyMode ? 'var(--bg-secondary)' : 'transparent',
          color: privacyMode ? 'var(--text-primary)' : 'var(--text-secondary)',
          border: '1px solid ' + (privacyMode ? 'var(--border-color)' : 'transparent'),
          borderRadius: '6px',
          cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, width: '100%',
          transition: 'all 0.15s ease'
        }}
      >
        {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
        {privacyMode ? 'Privacy: On' : 'Privacy Mode'}
      </motion.button>

      {/* User Card */}
      {user && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUser((v) => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.65rem 0.85rem',
              background: showUser ? 'var(--bg-secondary)' : 'transparent', 
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--border-color)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {displayName[0].toUpperCase()}
              </div>
            )}
            <span style={{ flex: 1, textAlign: 'left', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </span>
            <ChevronDown size={14} style={{ transform: showUser ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s', color: 'var(--text-secondary)' }} />
          </button>

          {showUser && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute', bottom: '110%', left: 0, right: 0,
                background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                padding: '0.5rem', zIndex: 200,
                marginBottom: '0.5rem'
              }}
            >
              <div style={{ padding: '0.5rem', marginBottom: '0.25rem', borderBottom: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
              </div>
              <button
                onClick={signOut}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem', 
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#EF4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                  transition: 'background 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#FEF2F2'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </motion.div>
          )}
        </div>
      )}
    </aside>
  )
}
