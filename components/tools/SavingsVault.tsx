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
    <div className="glass-card" style={{ padding: '1.5rem', border: '3px solid #00E5FF', boxShadow: '4px 4px 0px #00E5FF' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <Vault size={22} color="#00E5FF" strokeWidth={3} />
        <h3 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', color: '#00E5FF' }}>Savings Vault</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#000', background: '#00E5FF', padding: '0.3rem 0.6rem', borderRadius: '0', fontWeight: 800, textTransform: 'uppercase', border: '2px solid #FFF' }}>
          Round-up savings
        </span>
      </div>

      {/* Total */}
      <div style={{ padding: '1.25rem', background: '#000', border: '3px solid #00E5FF', borderRadius: '0', marginBottom: '1.5rem', textAlign: 'center', boxShadow: '2px 2px 0px #00E5FF' }}>
        <p style={{ fontSize: '0.8rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', fontWeight: 800 }}>Total Saved</p>
        <p className={privacyMode ? 'privacy-blur' : 'gradient-text'} style={{ fontSize: '2.5rem', fontWeight: 900, color: '#00E5FF', textShadow: '2px 2px 0px #FFF' }}>{fmt(total)}</p>
        <p style={{ fontSize: '0.8rem', color: '#FFF', marginTop: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
          {savingsVault.length} contributions
        </p>
      </div>

      {/* History */}
      {savingsVault.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#FFF', fontSize: '0.85rem', padding: '1rem', border: '2px dashed #FFF', textTransform: 'uppercase', fontWeight: 800 }}>
          Add expenses to start accumulating!
        </p>
      ) : (
        <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <AnimatePresence>
            {savingsVault.slice(0, 20).map((sv) => (
              <motion.div
                key={sv.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: '#000', border: '2px solid #FFF', borderRadius: '0', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowDownRight size={16} color="#00E5FF" strokeWidth={3} />
                  <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 800 }}>
                    {format(new Date(sv.created_at), 'MMM d')}
                  </span>
                </div>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 900, fontSize: '0.9rem', color: '#00E5FF' }}>
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
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: total <= 0 ? 0.5 : 1, background: '#00E5FF', color: '#000', fontSize: '1rem', letterSpacing: '0.05em' }}
      >
        <Banknote size={18} strokeWidth={3} /> WITHDRAW TO BALANCE
      </button>
    </div>
  )
}
