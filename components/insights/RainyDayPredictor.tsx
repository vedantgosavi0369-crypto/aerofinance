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
  const riskColor = risk === 'low' ? '#00E676' : risk === 'medium' ? '#FFEB3B' : '#FF4081'
  const riskLabel = risk === 'low' ? 'Financially Healthy' : risk === 'medium' ? 'Watch Your Spending' : 'Balance Alert!'

  // Gauge percentage (clamped 0-100)
  const gaugePercent = Math.min(100, Math.max(0, projected > 0 ? Math.min(100, (projected / Math.max(balance, 1)) * 100) : 0))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`glass-card`}
      style={{
        padding: '1.75rem',
        background: '#000',
        borderColor: riskColor,
        boxShadow: `4px 4px 0px ${riskColor}`,
        marginTop: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <CloudRain size={24} color={riskColor} strokeWidth={3} />
        <h3 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', color: riskColor }}>Rainy Day Predictor</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#000', fontWeight: 800, background: riskColor, border: `2px solid #FFF`, padding: '0.3rem 0.75rem', borderRadius: '0', textTransform: 'uppercase' }}>
          {riskLabel}
        </span>
      </div>

      {/* Gauge Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ height: 12, background: '#000', border: '2px solid #FFF', borderRadius: 0, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${gaugePercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: riskColor, borderRadius: 0, borderRight: '2px solid #FFF' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: 800, textTransform: 'uppercase' }}>Depleted</span>
          <span style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: 800, textTransform: 'uppercase' }}>Healthy</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        <PredictorStat label="Current Balance" value={fmt(balance)} icon={<TrendingUp size={16} color="#00E676" strokeWidth={3} />} color="#00E676" privacy={privacyMode} />
        <PredictorStat label="Avg Daily Spend" value={`-₹${avgDaily.toFixed(2)}`} icon={<TrendingDown size={16} color="#FFEB3B" strokeWidth={3} />} color="#FFEB3B" privacy={privacyMode} />
        <PredictorStat label="30-Day Projection" value={fmt(projected)} icon={<CloudRain size={16} color={riskColor} strokeWidth={3} />} color={riskColor} privacy={privacyMode} large />
      </div>

      <div style={{ marginTop: '1.2rem', padding: '0.75rem 1rem', background: '#000', border: '2px dashed #FFF', borderRadius: '0', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <Info size={16} color="#FFF" strokeWidth={3} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
        <p style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 800, lineHeight: 1.5, textTransform: 'uppercase' }}>
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
    <div style={{ padding: '0.85rem', background: '#000', borderRadius: '0', border: '3px solid #FFF', boxShadow: `3px 3px 0px ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
        {icon}
        <span style={{ fontSize: '0.75rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>{label}</span>
      </div>
      <p className={privacy ? 'privacy-blur' : ''} style={{ fontWeight: 900, fontSize: large ? '1.5rem' : '1.2rem', color }}>
        {value}
      </p>
    </div>
  )
}
