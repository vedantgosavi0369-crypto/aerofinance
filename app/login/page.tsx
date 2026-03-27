'use client'

import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase-browser'
import { useSearchParams } from 'next/navigation'
import { Zap } from 'lucide-react'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: '#7c6aff', top: -200, left: -150, filter: 'blur(80px)', opacity: 0.12, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: '#06d6a0', bottom: -150, right: -100, filter: 'blur(80px)', opacity: 0.1, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 300, height: 300, borderRadius: '50%', background: '#ff6b97', top: '40%', right: '30%', filter: 'blur(80px)', opacity: 0.08, pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '3rem 2.5rem',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #7c6aff, #06d6a0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(124,106,255,0.3)',
          }}>
            <Zap size={30} color="white" fill="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">
              AeroFinance
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(232,232,240,0.45)', marginTop: '0.3rem' }}>
              Weightless money management
            </p>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,107,151,0.1)',
              border: '1px solid rgba(255,107,151,0.25)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              color: '#ff6b97',
            }}
          >
            Sign-in failed. Please try again.
          </motion.div>
        )}

        <p style={{ color: 'rgba(232,232,240,0.5)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Sign in to access your personal financial dashboard with real-time insights.
        </p>

        {/* Google Sign In Button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(124,106,255,0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.9rem 1.5rem',
            background: 'linear-gradient(135deg, rgba(124,106,255,0.2), rgba(6,214,160,0.1))',
            border: '1px solid rgba(124,106,255,0.35)',
            borderRadius: '0.85rem',
            color: '#e8e8f0',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          {/* Google SVG icon */}
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </motion.button>

        <p style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.25)', marginTop: '1.75rem', lineHeight: 1.6 }}>
          By continuing, you agree to our Terms of Service. Your financial data is stored securely in Supabase.
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
