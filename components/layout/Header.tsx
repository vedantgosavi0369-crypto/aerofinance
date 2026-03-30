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
      paddingBottom: '1.25rem',
      borderBottom: '1px solid var(--border-color)',
      flexWrap: 'wrap',
      gap: '1rem',
    }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{title}</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{today}</p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '0.5rem 1rem',
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Balance</span>
        <span
          style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}
          className={privacyMode ? 'privacy-blur' : ''}
        >
          {balance >= 0 ? '+' : ''}₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </header>
  )
}
