'use client'

import { motion } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import Header from '@/components/layout/Header'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Users, Loader2 } from 'lucide-react'
import RainyDayPredictor from '@/components/insights/RainyDayPredictor'

const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const ACCENT_MAP: Record<string, string> = {
  income:   '#4ADE80',
  expenses: '#FB7185',
  lended:   '#FCD34D',
  borrowed: '#A78BFA',
  net:      '#34D8EB',
  savings:  '#5B9BFF',
}

function StatCard({ label, value, icon: Icon, accentKey, sub }: {
  label: string; value: string; icon: React.ElementType; accentKey: string; sub?: string
}) {
  const { privacyMode } = useFinanceStore()
  const accent = ACCENT_MAP[accentKey] ?? '#fff'
  return (
    <motion.div
      variants={card}
      className="glass-card"
      style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Accent glow at top-right */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: accent, opacity: 0.08, filter: 'blur(20px)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
          <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontSize: '1.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.95)', lineHeight: 1.1 }}>{value}</p>
          {sub && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.4rem' }}>{sub}</p>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} color={accent} />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { getTotalBalance, getTotalIncome, getTotalExpenses, getTotalLended, getTotalBorrowed, getTotalSavings, loading, privacyMode } = useFinanceStore()

  const balance  = getTotalBalance()
  const income   = getTotalIncome()
  const expenses = getTotalExpenses()
  const lended   = getTotalLended()
  const borrowed = getTotalBorrowed()
  const savings  = getTotalSavings()

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <Loader2 size={36} color="rgba(255,255,255,0.5)" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading your finances…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100 }}>
      <Header title="Dashboard" />

      {/* Hero Balance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card"
        style={{ padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}
      >
        {/* Radial accent glow */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,155,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Liquidity</p>
        <p className={privacyMode ? 'privacy-blur' : 'gradient-text'} style={{ fontSize: '3.25rem', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {balance >= 0 ? '+' : ''}{fmt(balance)}
        </p>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { label: 'Income',   value: fmt(income),   icon: <ArrowUpRight size={13}/>,   color: '#4ADE80' },
            { label: 'Borrowed', value: fmt(borrowed), icon: <ArrowUpRight size={13}/>,   color: '#A78BFA' },
            { label: 'Expenses', value: fmt(expenses), icon: <ArrowDownRight size={13}/>, color: '#FB7185' },
            { label: 'Lended',   value: fmt(lended),   icon: <ArrowDownRight size={13}/>, color: '#FCD34D' },
          ].map(chip => (
            <div key={chip.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{chip.label}</span>
              <span className={privacyMode ? 'privacy-blur' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: chip.color, fontWeight: 600, fontSize: '0.95rem' }}>
                <span style={{ opacity: 0.8 }}>{chip.icon}</span>{chip.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}
      >
        <StatCard label="Total Income"      value={fmt(income)}           icon={TrendingUp}    accentKey="income"   />
        <StatCard label="Total Expenses"    value={fmt(expenses)}         icon={TrendingDown}  accentKey="expenses" />
        <StatCard label="Lended Out"        value={fmt(lended)}           icon={ArrowUpRight}  accentKey="lended"   sub="Pending recovery" />
        <StatCard label="Borrowed"          value={fmt(borrowed)}         icon={ArrowDownRight} accentKey="borrowed" sub="Pending repay" />
        <StatCard label="Net Debt Position" value={fmt(borrowed - lended)} icon={Users}        accentKey="net"      sub={borrowed - lended >= 0 ? 'You owe more' : 'Others owe you'} />
        <StatCard label="Savings Vault"     value={fmt(savings)}          icon={Wallet}        accentKey="savings"  sub="From round-ups" />
      </motion.div>

      <RainyDayPredictor />
    </div>
  )
}
