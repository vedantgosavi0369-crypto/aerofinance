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
  { href: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/ledger',        label: 'Ledger',         icon: BookOpen },
  { href: '/subscriptions', label: 'Subscriptions',  icon: RefreshCw },
  { href: '/insights',      label: 'Insights',       icon: TrendingUp },
  { href: '/tools',         label: 'Tools',          icon: Wrench },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { privacyMode, togglePrivacyMode } = useFinanceStore()
  const { user, signOut } = useUser()
  const [showUser, setShowUser] = useState(false)

  const avatarUrl    = user?.user_metadata?.avatar_url
  const displayName  = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      /* Liquid glass panel */
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2.5rem', padding: '0.5rem 0.75rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(91,155,255,0.8), rgba(167,139,250,0.8))',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(91,155,255,0.3)',
          }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em' }}>
            AeroFinance
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
                  border: isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                  backdropFilter: isActive ? 'blur(8px)' : 'none',
                  WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
                  color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                  fontWeight: isActive ? 500 : 400,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.12)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Connect Wallet */}
      <div style={{ marginBottom: '0.75rem' }}>
        <ConnectWallet />
      </div>

      {/* Privacy Mode */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={togglePrivacyMode}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.6rem 0.85rem', marginBottom: '0.75rem',
          background: privacyMode ? 'rgba(251,113,133,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${privacyMode ? 'rgba(251,113,133,0.3)' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          color: privacyMode ? '#FB7185' : 'rgba(255,255,255,0.5)',
          cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, width: '100%',
          transition: 'all 0.2s ease',
        }}
      >
        {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
        {privacyMode ? 'Privacy: On' : 'Privacy Mode'}
      </motion.button>

      {/* User card */}
      {user && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUser(v => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.6rem 0.85rem',
              background: showUser ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              color: 'rgba(255,255,255,0.85)',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(91,155,255,0.7), rgba(167,139,250,0.7))', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                {displayName[0].toUpperCase()}
              </div>
            )}
            <span style={{ flex: 1, textAlign: 'left', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </span>
            <ChevronDown size={14} style={{ transform: showUser ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s', opacity: 0.5 }} />
          </button>

          {showUser && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{
                position: 'absolute', bottom: '110%', left: 0, right: 0,
                background: 'rgba(15,10,30,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                padding: '0.6rem', zIndex: 200,
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ padding: '0.5rem', marginBottom: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
              </div>
              <button
                onClick={signOut}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 0.6rem',
                  background: 'transparent', border: 'none', borderRadius: '8px',
                  color: '#FB7185', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                  fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(251,113,133,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
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
