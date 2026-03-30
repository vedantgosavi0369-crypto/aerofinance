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
    toast.success('Savings withdrawn!')
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: '#5B9BFF', opacity: 0.06, filter: 'blur(25px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(91,155,255,0.15)', border: '1px solid rgba(91,155,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Vault size={18} color="#5B9BFF" />
        </div>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>Savings Vault</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#5B9BFF', background: 'rgba(91,155,255,0.1)', border: '1px solid rgba(91,155,255,0.22)', padding: '0.2rem 0.6rem', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
          Round-ups
        </span>
      </div>

      <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', marginBottom: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Total Saved</p>
        <p className={privacyMode ? 'privacy-blur' : 'gradient-text-accent'} style={{ fontSize: '2.25rem', fontWeight: 600 }}>{fmt(total)}</p>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>{savingsVault.length} contributions</p>
      </div>

      {savingsVault.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', padding: '1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          Add expenses to accumulate round-up savings.
        </p>
      ) : (
        <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
          <AnimatePresence>
            {savingsVault.slice(0, 20).map(sv => (
              <motion.div key={sv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ArrowDownLeft size={13} color="rgba(91,155,255,0.7)" />
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{format(new Date(sv.created_at), 'MMM d')}</span>
                </div>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '0.88rem', color: '#5B9BFF' }}>+{fmt(sv.amount)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <button className="btn-primary" onClick={handleWithdraw} disabled={total <= 0} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', opacity: total <= 0 ? 0.4 : 1 }}>
        <Banknote size={17} /> Withdraw to Balance
      </button>
    </div>
  )
}
