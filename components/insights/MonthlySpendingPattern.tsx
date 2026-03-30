'use client'

import { motion } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import { isSameMonth, subMonths, parseISO } from 'date-fns'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

export default function MonthlySpendingPattern() {
  const { transactions, privacyMode } = useFinanceStore()
  
  const today = new Date()
  const lastMonthDate = subMonths(today, 1)

  // Filter only expenses
  const expenses = transactions.filter(t => t.type === 'expense')

  const thisMonthExpenses = expenses.filter(t => isSameMonth(parseISO(t.date), today))
  const lastMonthExpenses = expenses.filter(t => isSameMonth(parseISO(t.date), lastMonthDate))

  const thisMonthSum = thisMonthExpenses.reduce((acc, t) => acc + t.amount, 0)
  const lastMonthSum = lastMonthExpenses.reduce((acc, t) => acc + t.amount, 0)

  const diff = thisMonthSum - lastMonthSum
  const percentChange = lastMonthSum === 0 ? 0 : (diff / lastMonthSum) * 100
  
  const isMoreSpending = diff > 0
  const isLessSpending = diff < 0

  const fmt = (n: number) =>
    '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // Find out the category that increased the most
  const getCategorySums = (txs: typeof expenses) => {
    return txs.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
  }

  const thisMonthCatSums = getCategorySums(thisMonthExpenses)
  const lastMonthCatSums = getCategorySums(lastMonthExpenses)

  let maxIncreaseCategory = ''
  let maxIncreaseAmount = 0
  
  Object.entries(thisMonthCatSums).forEach(([cat, amount]) => {
    const lastAmount = lastMonthCatSums[cat] || 0
    const increase = amount - lastAmount
    if (increase > maxIncreaseAmount) {
      maxIncreaseAmount = increase
      maxIncreaseCategory = cat
    }
  })

  // Neo-Brutalist Styling Variables
  const brutalBg = isMoreSpending ? '#FF6B6B' : (isLessSpending ? '#4ECDC4' : '#F7FFF7')
  const brutalText = '#1A1A1D'

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -2, y: 20 }}
      animate={{ opacity: 1, rotate: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        background: brutalBg,
        border: '4px solid #1A1A1D',
        borderRadius: '12px',
        boxShadow: '6px 6px 0px #1A1A1D',
        padding: '1.5rem',
        marginTop: '1.5rem',
        color: brutalText,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Neo-Brutalist shapes */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: '#1A1A1D', borderRadius: '50%', opacity: 0.1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -10, left: -10, width: 60, height: 60, border: '4px solid #1A1A1D', opacity: 0.2, pointerEvents: 'none', transform: 'rotate(15deg)' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #1A1A1D', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
            Monthly Report
          </h2>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, marginTop: '0.2rem' }}>
            Vs Last Month
          </p>
        </div>
        <div style={{ 
          background: '#FFF', 
          border: '3px solid #1A1A1D', 
          boxShadow: '3px 3px 0px #1A1A1D',
          padding: '0.5rem', 
          borderRadius: '8px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {isMoreSpending ? (
            <TrendingUp size={28} color="#FF6B6B" strokeWidth={3} />
          ) : isLessSpending ? (
            <TrendingDown size={28} color="#4ECDC4" strokeWidth={3} />
          ) : (
            <AlertCircle size={28} color="#1A1A1D" strokeWidth={3} />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          {isMoreSpending ? 'Ouch! You spent' : isLessSpending ? 'Nice! You saved' : 'You spent exactly the same:'}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em' }}>
            {fmt(Math.abs(diff))}
          </span>
          {Math.abs(percentChange) > 0 && (
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: 800, 
              background: '#1A1A1D', 
              color: brutalBg, 
              padding: '0.2rem 0.6rem', 
              borderRadius: '4px' 
            }}>
              {isMoreSpending ? '+' : isLessSpending ? '-' : ''}{percentChange.toFixed(1)}%
            </span>
          )}
        </div>
        <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          {isMoreSpending ? 'more than last month.' : isLessSpending ? 'compared to last month!' : ''}
        </p>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        background: 'rgba(255,255,255,0.4)', 
        border: '3px dashed #1A1A1D', 
        padding: '1rem', 
        borderRadius: '8px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>This Month</span>
          <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 900, fontSize: '1.2rem' }}>{fmt(thisMonthSum)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '2px solid rgba(26,26,29,0.2)' }}>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>Last Month</span>
          <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 900, fontSize: '1.2rem' }}>{fmt(lastMonthSum)}</span>
        </div>
      </div>

      {maxIncreaseCategory && maxIncreaseAmount > 0 && (
        <div style={{ 
          marginTop: '1.5rem', 
          background: '#1A1A1D', 
          color: brutalBg, 
          padding: '0.75rem 1rem', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            <strong style={{ fontWeight: 800, textTransform: 'uppercase' }}>{maxIncreaseCategory}</strong> caused the biggest jump (+<span className={privacyMode ? 'privacy-blur' : ''}>{fmt(maxIncreaseAmount)}</span>).
          </span>
        </div>
      )}

    </motion.div>
  )
}
