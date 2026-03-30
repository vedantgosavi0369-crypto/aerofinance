'use client'

import { motion } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import { CloudRain, TrendingDown, TrendingUp, Info } from 'lucide-react'

export default function RainyDayPredictor() {
  const { getTotalBalance, getAvgDailySpend, privacyMode } = useFinanceStore()
  const balance = getTotalBalance()
  const avgDaily = getAvgDailySpend()
  const projected = balance - avgDaily * 30

  const fmt = (n: number) =>
    (n >= 0 ? '+₹' : '-₹') + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const risk = projected > 1000 ? 'low' : projected > 0 ? 'medium' : 'high'
  const riskLabel = risk === 'low' ? 'Financially Healthy' : risk === 'medium' ? 'Watch Your Spending' : 'Balance Alert'

  // Gauge percentage (clamped 0-100)
  const gaugePercent = Math.min(100, Math.max(0, projected > 0 ? Math.min(100, (projected / Math.max(balance, 1)) * 100) : 0))

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card"
      style={{
        padding: '1.5rem',
        marginTop: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <CloudRain size={20} color="var(--text-primary)" strokeWidth={2} />
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Rainy Day Predictor</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
          {riskLabel}
        </span>
      </div>

      {/* Gauge Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ height: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${gaugePercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: 'var(--text-primary)', borderRadius: '3px' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Depleted</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Healthy</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        <PredictorStat label="Current Balance" value={fmt(balance)} icon={<TrendingUp size={16} />} privacy={privacyMode} />
        <PredictorStat label="Avg Daily Spend" value={`-₹${avgDaily.toFixed(2)}`} icon={<TrendingDown size={16} />} privacy={privacyMode} />
        <PredictorStat label="30-Day Projection" value={fmt(projected)} icon={<CloudRain size={16} />} privacy={privacyMode} large />
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <Info size={14} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400, lineHeight: 1.5 }}>
          Formula: P(Balance₃₀) = Current Balance − (Avg Daily Spend × 30 days)
        </p>
      </div>
    </motion.div>
  )
}

function PredictorStat({ label, value, icon, privacy, large }: {
  label: string; value: string; icon: React.ReactNode; privacy: boolean; large?: boolean
}) {
  return (
    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{icon}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      </div>
      <p className={privacy ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: large ? '1.4rem' : '1.1rem', color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  )
}
