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

  const fmt = (n: number) => '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const getCategorySums = (txs: typeof expenses) =>
    txs.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc }, {} as Record<string, number>)

  const thisMonthCatSums = getCategorySums(thisMonthExpenses)
  const lastMonthCatSums = getCategorySums(lastMonthExpenses)
  let maxIncreaseCategory = '', maxIncreaseAmount = 0
  Object.entries(thisMonthCatSums).forEach(([cat, amount]) => {
    const increase = amount - (lastMonthCatSums[cat] || 0)
    if (increase > maxIncreaseAmount) { maxIncreaseAmount = increase; maxIncreaseCategory = cat }
  })

  const trendColor = isMoreSpending ? '#FB7185' : isLessSpending ? '#4ADE80' : '#FCD34D'

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="glass-card"
      style={{ padding: '1.5rem', marginTop: '1.5rem', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: trendColor, opacity: 0.07, filter: 'blur(25px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Monthly Report</h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>vs last month</p>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: '10px', background: `${trendColor}15`, border: `1px solid ${trendColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isMoreSpending ? <TrendingUp size={18} color={trendColor} /> : isLessSpending ? <TrendingDown size={18} color={trendColor} /> : <Minus size={18} color={trendColor} />}
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>
          {isMoreSpending ? 'You spent' : isLessSpending ? 'You saved' : 'No change — spent exactly the same'}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontSize: '2.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.02em' }}>
            {fmt(Math.abs(diff))}
          </span>
          {Math.abs(percentChange) > 0 && (
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: trendColor, background: `${trendColor}15`, padding: '0.2rem 0.65rem', borderRadius: '999px', border: `1px solid ${trendColor}30` }}>
              {isMoreSpending ? '+' : '-'}{Math.abs(percentChange).toFixed(1)}%
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.15rem' }}>
          {isMoreSpending ? 'more than last month.' : isLessSpending ? 'compared to last month.' : ''}
        </p>
      </div>

      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', marginBottom: maxIncreaseCategory ? '1rem' : 0 }}>
        {[{ label: 'This Month', value: thisMonthSum }, { label: 'Last Month', value: lastMonthSum }].map((row, i) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: i === 1 ? '0.6rem 0 0' : '0 0 0.6rem', borderTop: i === 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
            <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)' }}>{fmt(row.value)}</span>
          </div>
        ))}
      </div>

      {maxIncreaseCategory && maxIncreaseAmount > 0 && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.18)', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={15} color="#FCD34D" />
          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
            <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{maxIncreaseCategory}</strong> caused the biggest jump (+<span className={privacyMode ? 'privacy-blur' : ''}>{fmt(maxIncreaseAmount)}</span>).
          </span>
        </div>
      )}
    </motion.div>
  )
}
