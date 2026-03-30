'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types'
import toast from 'react-hot-toast'
import { PlusCircle, X } from 'lucide-react'

export default function TransactionForm() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [taxDeductible, setTaxDeductible] = useState(false)
  const [loading, setLoading] = useState(false)
  const addTransaction = useFinanceStore(s => s.addTransaction)

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return toast.error('Fill in amount and category')
    setLoading(true)
    await addTransaction({ type, amount: parseFloat(amount), category, note: note || null, date, tax_deductible: taxDeductible })
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} recorded!`)
    setAmount(''); setCategory(''); setNote(''); setTaxDeductible(false); setLoading(false); setOpen(false)
  }

  return (
    <>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary" onClick={() => setOpen(true)}>
        <PlusCircle size={17} /> Add Transaction
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,18,0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="glass-dark"
              style={{ width: '100%', maxWidth: 460, padding: '2rem', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.92)' }}>New Transaction</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0.3rem', display: 'flex' }}>
                  <X size={18} />
                </motion.button>
              </div>

              {/* Type Toggle */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {(['expense', 'income'] as const).map(t => (
                  <button key={t} onClick={() => { setType(t); setCategory('') }} style={{
                    flex: 1, padding: '0.5rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize',
                    background: type === t ? (t === 'income' ? 'rgba(74,222,128,0.18)' : 'rgba(251,113,133,0.18)') : 'transparent',
                    color: type === t ? (t === 'income' ? '#4ADE80' : '#FB7185') : 'rgba(255,255,255,0.4)',
                    border: type === t ? `1px solid ${t === 'income' ? 'rgba(74,222,128,0.3)' : 'rgba(251,113,133,0.3)'}` : '1px solid transparent',
                    backdropFilter: type === t ? 'blur(8px)' : 'none',
                    transition: 'all 0.2s ease',
                  }}>
                    {t}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div><label>Amount (₹)</label><input className="input-glass" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required /></div>
                <div><label>Category</label><select className="input-glass" value={category} onChange={e => setCategory(e.target.value)} required><option value="">Select category</option>{cats.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label>Date</label><input className="input-glass" type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
                <div><label>Note (optional)</label><input className="input-glass" value={note} onChange={e => setNote(e.target.value)} placeholder="Brief note…" /></div>
                {type === 'expense' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginBottom: 0, fontWeight: 500 }}>
                    <input type="checkbox" checked={taxDeductible} onChange={e => setTaxDeductible(e.target.checked)} style={{ accentColor: '#5B9BFF', width: 15, height: 15 }} />
                    Tax Deductible
                  </label>
                )}
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', background: type === 'income' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.14)', borderColor: type === 'income' ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.25)' }}>
                  {loading ? 'Saving…' : 'Save Transaction'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
