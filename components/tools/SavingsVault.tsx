'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Vault, ArrowDownLeft, Banknote } from 'lucide-react'

export default function SavingsVault() {
  const { savingsVault, withdrawSavings, getTotalSavings, privacyMode } = useFinanceStore()
  const total = getTotalSavings()

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleWithdraw = async () => {
    if (total <= 0) return toast.error('No savings to withdraw')
    await withdrawSavings()
    toast.success('Savings withdrawn to balance!')
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Vault size={20} color="var(--text-primary)" strokeWidth={2} />
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Savings Vault</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 500, border: '1px solid var(--border-color)' }}>
          Round-up savings
        </span>
      </div>

      {/* Total */}
      <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.4rem' }}>Total Saved</p>
        <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{fmt(total)}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          {savingsVault.length} contributions
        </p>
      </div>

      {/* History */}
      {savingsVault.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
          Add expenses to start accumulating round-up savings.
        </p>
      ) : (
        <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
          <AnimatePresence>
            {savingsVault.slice(0, 20).map((sv) => (
              <motion.div
                key={sv.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowDownLeft size={14} color="var(--text-secondary)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {format(new Date(sv.created_at), 'MMM d')}
                  </span>
                </div>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  +{fmt(sv.amount)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={handleWithdraw}
        disabled={total <= 0}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: total <= 0 ? 0.4 : 1 }}
      >
        <Banknote size={17} /> Withdraw to Balance
      </button>
    </div>
  )
}
