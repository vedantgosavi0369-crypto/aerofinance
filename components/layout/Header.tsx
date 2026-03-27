'use client'

import { format } from 'date-fns'
import { useFinanceStore } from '@/store/useFinanceStore'
import { DollarSign } from 'lucide-react'

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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#e8e8f0', lineHeight: 1.2 }}>{title}</h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(232,232,240,0.4)', marginTop: '0.2rem' }}>{today}</p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '0.85rem',
        padding: '0.5rem 1rem',
      }}>
        <DollarSign size={15} color="rgba(124,106,255,0.8)" />
        <span style={{ fontSize: '0.8rem', color: 'rgba(232,232,240,0.5)', marginRight: '0.4rem' }}>Balance</span>
        <span
          style={{ fontWeight: 700, fontSize: '1rem', color: balance >= 0 ? '#06d6a0' : '#ff6b97' }}
          className={privacyMode ? 'privacy-blur' : ''}
        >
          {balance >= 0 ? '+' : ''}₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </header>
  )
}
