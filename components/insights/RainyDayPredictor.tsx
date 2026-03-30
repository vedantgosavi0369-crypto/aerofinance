'use client'

import { motion } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import { CloudRain, TrendingDown, TrendingUp, Info } from 'lucide-react'

export default function RainyDayPredictor() {
  const { getTotalBalance, getAvgDailySpend, privacyMode } = useFinanceStore()
  const balance  = getTotalBalance()
  const avgDaily = getAvgDailySpend()
  const projected = balance - avgDaily * 30

  const fmt = (n: number) =>
    (n >= 0 ? '+₹' : '-₹') + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const risk = projected > 1000 ? 'low' : projected > 0 ? 'medium' : 'high'
  const riskColor = risk === 'low' ? '#4ADE80' : risk === 'medium' ? '#FCD34D' : '#FB7185'
  const riskLabel = risk === 'low' ? 'Financially Healthy' : risk === 'medium' ? 'Watch Spending' : 'Balance Alert'

  const gaugePercent = Math.min(100, Math.max(0, projected > 0 ? Math.min(100, (projected / Math.max(balance, 1)) * 100) : 0))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-card"
      style={{ padding: '1.75rem', marginTop: '1.5rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', bottom: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: riskColor, opacity: 0.06, filter: 'blur(30px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${riskColor}18`, border: `1px solid ${riskColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CloudRain size={18} color={riskColor} />
        </div>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.92)' }}>Rainy Day Predictor</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: riskColor, fontWeight: 500, background: `${riskColor}15`, border: `1px solid ${riskColor}30`, padding: '0.2rem 0.7rem', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
          {riskLabel}
        </span>
      </div>

      {/* Gauge */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${gaugePercent}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${riskColor}88, ${riskColor})`, boxShadow: `0 0 12px ${riskColor}60` }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Depleted</span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Healthy</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Current Balance',  value: fmt(balance),            color: '#4ADE80', Icon: TrendingUp  },
          { label: 'Avg Daily Spend',  value: `-₹${avgDaily.toFixed(2)}`, color: '#FCD34D', Icon: TrendingDown },
          { label: '30-Day Projection', value: fmt(projected),          color: riskColor,  Icon: CloudRain  },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Icon size={14} color={color} />
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
            </div>
            <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
        <Info size={14} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
          Formula: P(Balance₃₀) = Current Balance − (Avg Daily Spend × 30 days)
        </p>
      </div>
    </motion.div>
  )
}
