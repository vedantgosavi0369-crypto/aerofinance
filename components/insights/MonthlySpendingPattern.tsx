'use client'

import { motion } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import { isSameMonth, subMonths, parseISO } from 'date-fns'
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'

export default function MonthlySpendingPattern() {
  const { transactions, privacyMode } = useFinanceStore()
  
  const today = new Date()
  const lastMonthDate = subMonths(today, 1)

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card"
      style={{
        padding: '1.5rem',
        marginTop: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Monthly Report
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Vs Last Month
          </p>
        </div>
        <div style={{ 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)', 
          padding: '0.5rem', 
          borderRadius: '6px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {isMoreSpending ? (
            <TrendingUp size={20} color="var(--text-primary)" strokeWidth={2} />
          ) : isLessSpending ? (
            <TrendingDown size={20} color="var(--text-primary)" strokeWidth={2} />
          ) : (
            <Minus size={20} color="var(--text-secondary)" strokeWidth={2} />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          {isMoreSpending ? 'You spent' : isLessSpending ? 'You saved' : 'You spent exactly the same:'}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontSize: '2.5rem', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {fmt(Math.abs(diff))}
          </span>
          {Math.abs(percentChange) > 0 && (
            <span style={{ 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              background: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              padding: '0.25rem 0.6rem', 
              borderRadius: '4px',
              border: '1px solid var(--border-color)'
            }}>
              {isMoreSpending ? '+' : isLessSpending ? '-' : ''}{percentChange.toFixed(1)}%
            </span>
          )}
        </div>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          {isMoreSpending ? 'more than last month.' : isLessSpending ? 'compared to last month.' : ''}
        </p>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        background: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)', 
        padding: '1rem', 
        borderRadius: '6px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>This Month</span>
          <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{fmt(thisMonthSum)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Last Month</span>
          <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{fmt(lastMonthSum)}</span>
        </div>
      </div>

      {maxIncreaseCategory && maxIncreaseAmount > 0 && (
        <div style={{ 
          marginTop: '1.5rem', 
          background: 'var(--bg-primary)', 
          border: '1px solid var(--border-color)',
          padding: '0.85rem 1rem', 
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}>
          <AlertCircle size={16} color="var(--text-secondary)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{maxIncreaseCategory}</strong> caused the biggest jump (+<span className={privacyMode ? 'privacy-blur' : ''} style={{ color: 'var(--text-primary)' }}>{fmt(maxIncreaseAmount)}</span>).
          </span>
        </div>
      )}

    </motion.div>
  )
}
