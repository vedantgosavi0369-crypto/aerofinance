'use client'

import { motion } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import Header from '@/components/layout/Header'
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Users,
  Loader2,
} from 'lucide-react'
import RainyDayPredictor from '@/components/insights/RainyDayPredictor'

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
  glow,
}: {
  label: string
  value: string
  icon: React.ElementType
  color: string
  sub?: string
  glow?: string
}) {
  const { privacyMode } = useFinanceStore()
  return (
    <motion.div variants={card} className={`glass-card ${glow ?? ''}`} style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'rgba(232,232,240,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{label}</p>
          <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontSize: '1.7rem', fontWeight: 700, color, lineHeight: 1.1 }}>{value}</p>
          {sub && <p style={{ fontSize: '0.78rem', color: 'rgba(232,232,240,0.4)', marginTop: '0.4rem' }}>{sub}</p>}
        </div>
        <div style={{ background: `${color}18`, border: `1px solid ${color}30`, borderRadius: '0.75rem', padding: '0.6rem' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const {
    getTotalBalance,
    getTotalIncome,
    getTotalExpenses,
    getTotalLended,
    getTotalBorrowed,
    getTotalSavings,
    loading,
    privacyMode,
  } = useFinanceStore()

  const balance = getTotalBalance()
  const income = getTotalIncome()
  const expenses = getTotalExpenses()
  const lended = getTotalLended()
  const borrowed = getTotalBorrowed()
  const savings = getTotalSavings()

  const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={36} color="#7c6aff" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'rgba(232,232,240,0.4)' }}>Loading your finances…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <Header title="Dashboard" />

      {/* Hero Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card glow-purple"
        style={{
          padding: '2rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(124,106,255,0.1), rgba(6,214,160,0.05))',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,106,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <p style={{ fontSize: '0.8rem', color: 'rgba(232,232,240,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Total Liquidity</p>
        <p
          className={privacyMode ? 'privacy-blur' : 'gradient-text'}
          style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}
        >
          {balance >= 0 ? '+' : ''}{fmt(balance)}
        </p>
        <div style={{ marginTop: '1.2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <FormulaChip label="Income" value={fmt(income)} color="#06d6a0" icon={<ArrowUpRight size={13} />} privacy={privacyMode} />
          <span style={{ color: 'rgba(232,232,240,0.2)', fontWeight: 300, fontSize: '1.2rem', alignSelf: 'center' }}>+</span>
          <FormulaChip label="Borrowed" value={fmt(borrowed)} color="#a897ff" icon={<ArrowUpRight size={13} />} privacy={privacyMode} />
          <span style={{ color: 'rgba(232,232,240,0.2)', fontWeight: 300, fontSize: '1.2rem', alignSelf: 'center' }}>−</span>
          <FormulaChip label="Expenses" value={fmt(expenses)} color="#ff6b97" icon={<ArrowDownRight size={13} />} privacy={privacyMode} />
          <span style={{ color: 'rgba(232,232,240,0.2)', fontWeight: 300, fontSize: '1.2rem', alignSelf: 'center' }}>−</span>
          <FormulaChip label="Lended" value={fmt(lended)} color="#ffb347" icon={<ArrowDownRight size={13} />} privacy={privacyMode} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}
      >
        <StatCard label="Total Income" value={fmt(income)} icon={TrendingUp} color="#06d6a0" glow="glow-green" />
        <StatCard label="Total Expenses" value={fmt(expenses)} icon={TrendingDown} color="#ff6b97" glow="glow-red" />
        <StatCard label="Lended Out" value={fmt(lended)} icon={ArrowUpRight} color="#ffb347" sub="Pending recovery" />
        <StatCard label="Borrowed" value={fmt(borrowed)} icon={ArrowDownRight} color="#a897ff" sub="Pending repay" />
        <StatCard label="Net Debt Position" value={fmt(borrowed - lended)} icon={Users} color={borrowed - lended >= 0 ? '#a897ff' : '#ffb347'} sub={borrowed - lended >= 0 ? 'You owe more' : 'Others owe you'} />
        <StatCard label="Savings Vault" value={fmt(savings)} icon={Wallet} color="#7c6aff" sub="From round‑ups" glow="glow-purple" />
      </motion.div>

      {/* Rainy Day Predictor */}
      <RainyDayPredictor />
    </div>
  )
}

function FormulaChip({ label, value, color, icon, privacy }: { label: string; value: string; color: string; icon: React.ReactNode; privacy: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span style={{ fontSize: '0.7rem', color: 'rgba(232,232,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color, fontWeight: 600, fontSize: '0.9rem' }} className={privacy ? 'privacy-blur' : ''}>
        {icon}{value}
      </span>
    </div>
  )
}
