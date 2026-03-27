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
      width: '220px',
      minHeight: '100vh',
      background: 'rgba(6,6,19,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #7c6aff, #06d6a0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e8e8f0' }}>AeroFinance</span>
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 0.85rem', borderRadius: '0.75rem',
                  background: isActive ? 'linear-gradient(135deg, rgba(124,106,255,0.2), rgba(6,214,160,0.1))' : 'transparent',
                  border: isActive ? '1px solid rgba(124,106,255,0.25)' : '1px solid transparent',
                  color: isActive ? '#a897ff' : 'rgba(232,232,240,0.5)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />
                {label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Privacy Mode */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={togglePrivacyMode}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.6rem 0.85rem', borderRadius: '0.75rem', marginBottom: '0.5rem',
          background: privacyMode ? 'rgba(255,107,151,0.1)' : 'rgba(255,255,255,0.04)',
          border: privacyMode ? '1px solid rgba(255,107,151,0.25)' : '1px solid rgba(255,255,255,0.08)',
          color: privacyMode ? '#ff6b97' : 'rgba(232,232,240,0.5)',
          cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, width: '100%',
        }}
      >
        {privacyMode ? <EyeOff size={15} /> : <Eye size={15} />}
        {privacyMode ? 'Privacy On' : 'Privacy Mode'}
      </motion.button>

      {/* User Card */}
      {user && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUser((v) => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.65rem 0.85rem', borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7c6aff,#06d6a0)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                {displayName[0].toUpperCase()}
              </div>
            )}
            <span style={{ flex: 1, textAlign: 'left', fontSize: '0.8rem', color: 'rgba(232,232,240,0.7)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </span>
            <ChevronDown size={13} color="rgba(232,232,240,0.4)" style={{ transform: showUser ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
          </button>

          {showUser && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute', bottom: '110%', left: 0, right: 0,
                background: 'rgba(13,13,31,0.98)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem', padding: '0.5rem', zIndex: 200,
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.25rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,240,0.4)' }}>{user.email}</p>
              </div>
              <button
                onClick={signOut}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                  background: 'rgba(255,107,151,0.08)', border: '1px solid rgba(255,107,151,0.15)',
                  color: '#ff6b97', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </motion.div>
          )}
        </div>
      )}
    </aside>
  )
}
