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
  const riskColor = risk === 'low' ? '#06d6a0' : risk === 'medium' ? '#ffb347' : '#ff6b97'
  const riskGlow = risk === 'low' ? 'glow-green' : risk === 'high' ? 'glow-red' : ''
  const riskLabel = risk === 'low' ? 'Financially Healthy' : risk === 'medium' ? 'Watch Your Spending' : 'Balance Alert!'

  // Gauge percentage (clamped 0-100)
  const gaugePercent = Math.min(100, Math.max(0, projected > 0 ? Math.min(100, (projected / Math.max(balance, 1)) * 100) : 0))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`glass-card ${riskGlow}`}
      style={{
        padding: '1.75rem',
        background: `linear-gradient(135deg, rgba(13,13,31,0.8), ${riskColor}08)`,
        marginTop: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <CloudRain size={20} color={riskColor} />
        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Rainy Day Predictor</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: riskColor, fontWeight: 600, background: `${riskColor}15`, border: `1px solid ${riskColor}30`, padding: '0.2rem 0.75rem', borderRadius: '999px' }}>
          {riskLabel}
        </span>
      </div>

      {/* Gauge Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${gaugePercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${riskColor}80, ${riskColor})`, borderRadius: 999 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(232,232,240,0.35)' }}>Depleted</span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(232,232,240,0.35)' }}>Healthy</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        <PredictorStat label="Current Balance" value={fmt(balance)} icon={<TrendingUp size={14} color="#06d6a0" />} color="#06d6a0" privacy={privacyMode} />
        <PredictorStat label="Avg Daily Spend" value={`-₹${avgDaily.toFixed(2)}`} icon={<TrendingDown size={14} color="#ffb347" />} color="#ffb347" privacy={privacyMode} />
        <PredictorStat label="30-Day Projection" value={fmt(projected)} icon={<CloudRain size={14} color={riskColor} />} color={riskColor} privacy={privacyMode} large />
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.65rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <Info size={13} color="rgba(232,232,240,0.35)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
        <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,240,0.35)', lineHeight: 1.5 }}>
          Formula: P(Balance₃₀) = Current Balance − (Avg Daily Spend × 30 days)
        </p>
      </div>
    </motion.div>
  )
}

function PredictorStat({ label, value, icon, color, privacy, large }: {
  label: string; value: string; icon: React.ReactNode; color: string; privacy: boolean; large?: boolean
}) {
  return (
    <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
        {icon}
        <span style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <p className={privacy ? 'privacy-blur' : ''} style={{ fontWeight: 700, fontSize: large ? '1.3rem' : '1rem', color }}>
        {value}
      </p>
    </div>
  )
}
