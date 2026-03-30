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
      width: '220px',
      minHeight: '100vh',
      background: '#000000',
      borderRight: '4px solid #FFFFFF',
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
          <div style={{ width: 36, height: 36, border: '3px solid #FFF', background: '#FFEB3B', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #FFF' }}>
            <Zap size={20} color="#000" fill="#000" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>AeroFinance</span>
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  background: isActive ? '#00E676' : 'transparent',
                  border: isActive ? '3px solid #FFFFFF' : '3px solid transparent',
                  boxShadow: isActive ? '3px 3px 0px #FFFFFF' : 'none',
                  color: isActive ? '#000000' : '#FFFFFF',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 3 : 2} />
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
        whileHover={{ x: 2, y: 2, boxShadow: '1px 1px 0px #FFF' }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePrivacyMode}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.6rem 0.85rem', marginBottom: '0.75rem',
          background: privacyMode ? '#FF4081' : '#000',
          border: '3px solid #FFF',
          boxShadow: '3px 3px 0px #FFF',
          color: privacyMode ? '#000' : '#FFF',
          cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, width: '100%',
          textTransform: 'uppercase',
          transition: 'all 0.1s'
        }}
      >
        {privacyMode ? <EyeOff size={16} strokeWidth={3} /> : <Eye size={16} strokeWidth={2} />}
        {privacyMode ? 'Privacy On' : 'Privacy Mode'}
      </motion.button>

      {/* User Card */}
      {user && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUser((v) => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.65rem 0.85rem',
              background: showUser ? '#FFF' : '#000', 
              border: '3px solid #FFF',
              boxShadow: '3px 3px 0px #FFF',
              color: showUser ? '#000' : '#FFF',
              cursor: 'pointer',
              transition: 'all 0.1s'
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: 28, height: 28, border: '2px solid' + (showUser ? '#000' : '#FFF'), borderRadius: 0, flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, border: '2px solid ' + (showUser ? '#000' : '#FFF'), background: '#B28DFF', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#000' }}>
                {displayName[0].toUpperCase()}
              </div>
            )}
            <span style={{ flex: 1, textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </span>
            <ChevronDown size={16} strokeWidth={3} style={{ transform: showUser ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
          </button>

          {showUser && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute', bottom: '110%', left: 0, right: 0,
                background: '#000', border: '4px solid #FFF',
                boxShadow: '4px 4px 0px #FFF',
                padding: '0.75rem', zIndex: 200,
                marginBottom: '1rem'
              }}
            >
              <div style={{ padding: '0.25rem 0', marginBottom: '0.5rem', borderBottom: '2px dashed #FFF', paddingBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFF' }}>{user.email}</p>
              </div>
              <button
                onClick={signOut}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.5rem 0.75rem', 
                  background: '#FF4081', border: '3px solid #000',
                  boxShadow: '2px 2px 0px #000',
                  color: '#000', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 800,
                  textTransform: 'uppercase'
                }}
              >
                <LogOut size={16} strokeWidth={3} /> Sign Out
              </button>
            </motion.div>
          )}
        </div>
      )}
    </aside>
  )
}
