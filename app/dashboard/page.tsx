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
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string
  value: string
  icon: React.ElementType
  sub?: string
}) {
  const { privacyMode } = useFinanceStore()
  return (
    <motion.div variants={card} className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.4rem' }}>{label}</p>
          <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value}</p>
          {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{sub}</p>}
        </div>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.5rem' }}>
          <Icon size={18} color="var(--text-secondary)" />
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
        <Loader2 size={32} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Loading finances…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <Header title="Dashboard" />

      {/* Hero Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
      >
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>Total Liquidity</p>
        <p
          className={privacyMode ? 'privacy-blur' : ''}
          style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--text-primary)' }}
        >
          {balance >= 0 ? '+' : ''}{fmt(balance)}
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', width: '100%' }}>
          <FormulaChip label="Income" value={fmt(income)} icon={<ArrowUpRight size={14} />} privacy={privacyMode} />
          <span style={{ color: 'var(--border-color)', fontWeight: 300, fontSize: '1.2rem', alignSelf: 'center' }}>+</span>
          <FormulaChip label="Borrowed" value={fmt(borrowed)} icon={<ArrowUpRight size={14} />} privacy={privacyMode} />
          <span style={{ color: 'var(--border-color)', fontWeight: 300, fontSize: '1.2rem', alignSelf: 'center' }}>−</span>
          <FormulaChip label="Expenses" value={fmt(expenses)} icon={<ArrowDownRight size={14} />} privacy={privacyMode} />
          <span style={{ color: 'var(--border-color)', fontWeight: 300, fontSize: '1.2rem', alignSelf: 'center' }}>−</span>
          <FormulaChip label="Lended" value={fmt(lended)} icon={<ArrowDownRight size={14} />} privacy={privacyMode} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}
      >
        <StatCard label="Total Income" value={fmt(income)} icon={TrendingUp} />
        <StatCard label="Total Expenses" value={fmt(expenses)} icon={TrendingDown} />
        <StatCard label="Lended Out" value={fmt(lended)} icon={ArrowUpRight} sub="Pending recovery" />
        <StatCard label="Borrowed" value={fmt(borrowed)} icon={ArrowDownRight} sub="Pending repay" />
        <StatCard label="Net Debt Position" value={fmt(borrowed - lended)} icon={Users} sub={borrowed - lended >= 0 ? 'You owe more' : 'Others owe you'} />
        <StatCard label="Savings Vault" value={fmt(savings)} icon={Wallet} sub="From round-ups" />
      </motion.div>

      {/* Rainy Day Predictor */}
      <RainyDayPredictor />
    </div>
  )
}

function FormulaChip({ label, value, icon, privacy }: { label: string; value: string; icon: React.ReactNode; privacy: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }} className={privacy ? 'privacy-blur' : ''}>
        <span style={{ color: 'var(--text-secondary)' }}>{icon}</span> {value}
      </span>
    </div>
  )
}
