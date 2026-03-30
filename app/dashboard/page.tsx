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
    <motion.div variants={card} className={`glass-card ${glow ?? ''}`} style={{ padding: '1.5rem', borderColor: color, boxShadow: `4px 4px 0px ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 800 }}>{label}</p>
          <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontSize: '1.8rem', fontWeight: 900, color, lineHeight: 1.1 }}>{value}</p>
          {sub && <p style={{ fontSize: '0.8rem', color: '#FFF', marginTop: '0.5rem', fontWeight: 600, borderLeft: `2px solid ${color}`, paddingLeft: '0.4rem' }}>{sub}</p>}
        </div>
        <div style={{ background: '#000', border: `3px solid ${color}`, padding: '0.6rem', boxShadow: `2px 2px 0px ${color}` }}>
          <Icon size={22} color={color} strokeWidth={3} />
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
        <Loader2 size={40} color="#B28DFF" strokeWidth={3} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#FFF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading Finances...</p>
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
          position: 'relative',
        }}
      >
        <p style={{ fontSize: '0.9rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 900 }}>Total Liquidity</p>
        <p
          className={privacyMode ? 'privacy-blur' : 'gradient-text'}
          style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          {balance >= 0 ? '+' : ''}{fmt(balance)}
        </p>
        <div style={{ marginTop: '1.2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderTop: '3px dashed #B28DFF', paddingTop: '1.2rem' }}>
          <FormulaChip label="Income" value={fmt(income)} color="#00E676" icon={<ArrowUpRight size={15} strokeWidth={3} />} privacy={privacyMode} />
          <span style={{ color: '#FFF', fontWeight: 900, fontSize: '1.5rem', alignSelf: 'center' }}>+</span>
          <FormulaChip label="Borrowed" value={fmt(borrowed)} color="#B28DFF" icon={<ArrowUpRight size={15} strokeWidth={3} />} privacy={privacyMode} />
          <span style={{ color: '#FFF', fontWeight: 900, fontSize: '1.5rem', alignSelf: 'center' }}>−</span>
          <FormulaChip label="Expenses" value={fmt(expenses)} color="#FF4081" icon={<ArrowDownRight size={15} strokeWidth={3} />} privacy={privacyMode} />
          <span style={{ color: '#FFF', fontWeight: 900, fontSize: '1.5rem', alignSelf: 'center' }}>−</span>
          <FormulaChip label="Lended" value={fmt(lended)} color="#FFEB3B" icon={<ArrowDownRight size={15} strokeWidth={3} />} privacy={privacyMode} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}
      >
        <StatCard label="Total Income" value={fmt(income)} icon={TrendingUp} color="#00E676" glow="glow-green" />
        <StatCard label="Total Expenses" value={fmt(expenses)} icon={TrendingDown} color="#FF4081" glow="glow-red" />
        <StatCard label="Lended Out" value={fmt(lended)} icon={ArrowUpRight} color="#FFEB3B" sub="Pending recovery" />
        <StatCard label="Borrowed" value={fmt(borrowed)} icon={ArrowDownRight} color="#B28DFF" sub="Pending repay" />
        <StatCard label="Net Debt Position" value={fmt(borrowed - lended)} icon={Users} color={borrowed - lended >= 0 ? '#B28DFF' : '#FFEB3B'} sub={borrowed - lended >= 0 ? 'You owe more' : 'Others owe you'} />
        <StatCard label="Savings Vault" value={fmt(savings)} icon={Wallet} color="#00E5FF" sub="From round‑ups" glow="glow-cyan" />
      </motion.div>

      {/* Rainy Day Predictor */}
      <RainyDayPredictor />
    </div>
  )
}

function FormulaChip({ label, value, color, icon, privacy }: { label: string; value: string; color: string; icon: React.ReactNode; privacy: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem', border: `2px solid ${color}`, background: '#000', boxShadow: `2px 2px 0px ${color}` }}>
      <span style={{ fontSize: '0.75rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color, fontWeight: 900, fontSize: '1rem' }} className={privacy ? 'privacy-blur' : ''}>
        {icon}{value}
      </span>
    </div>
  )
}
