'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Vault, ArrowDownRight, Banknote } from 'lucide-react'

export default function SavingsVault() {
  const { savingsVault, withdrawSavings, getTotalSavings, privacyMode } = useFinanceStore()
  const total = getTotalSavings()

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleWithdraw = async () => {
    if (total <= 0) return toast.error('No savings to withdraw')
    await withdrawSavings()
    toast.success('💸 Savings withdrawn to balance!')
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <Vault size={18} color="#7c6aff" />
        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Savings Vault</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'rgba(232,232,240,0.4)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
          Round-up savings
        </span>
      </div>

      {/* Total */}
      <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(124,106,255,0.1), rgba(6,214,160,0.05))', borderRadius: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Total Saved</p>
        <p className={privacyMode ? 'privacy-blur' : 'gradient-text'} style={{ fontSize: '2rem', fontWeight: 800 }}>{fmt(total)}</p>
        <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,240,0.35)', marginTop: '0.35rem' }}>
          {savingsVault.length} round-up contributions
        </p>
      </div>

      {/* History */}
      {savingsVault.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(232,232,240,0.3)', fontSize: '0.85rem', padding: '1rem' }}>
          Add expenses to start accumulating round-ups!
        </p>
      ) : (
        <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
          <AnimatePresence>
            {savingsVault.slice(0, 20).map((sv) => (
              <motion.div
                key={sv.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowDownRight size={13} color="#7c6aff" />
                  <span style={{ fontSize: '0.78rem', color: 'rgba(232,232,240,0.5)' }}>
                    {format(new Date(sv.created_at), 'MMM d')}
                  </span>
                </div>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '0.85rem', color: '#7c6aff' }}>
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
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: total <= 0 ? 0.5 : 1 }}
      >
        <Banknote size={15} /> Withdraw to Balance
      </button>
    </div>
  )
}
