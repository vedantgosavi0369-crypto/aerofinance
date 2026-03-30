'use client'

import { format } from 'date-fns'
import { useFinanceStore } from '@/store/useFinanceStore'

export default function Header({ title }: { title: string }) {
  const { getTotalBalance, privacyMode } = useFinanceStore()
  const balance = getTotalBalance()
  const today = format(new Date(), 'EEEE, MMMM d')

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.95)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>{today}</p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: '999px',
        padding: '0.45rem 1rem',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: balance >= 0 ? '#4ADE80' : '#FB7185', boxShadow: `0 0 8px ${balance >= 0 ? '#4ADE80' : '#FB7185'}` }} />
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Balance</span>
        <span
          className={privacyMode ? 'privacy-blur' : ''}
          style={{ fontWeight: 600, fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}
        >
          {balance >= 0 ? '+' : ''}₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </header>
  )
}
