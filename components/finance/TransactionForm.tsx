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
  const addTransaction = useFinanceStore((s) => s.addTransaction)

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return toast.error('Fill in amount and category')
    setLoading(true)
    await addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      note: note || null,
      date,
      tax_deductible: taxDeductible,
    })
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} recorded!`)
    setAmount(''); setCategory(''); setNote(''); setTaxDeductible(false)
    setLoading(false)
    setOpen(false)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary"
        onClick={() => setOpen(true)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <PlusCircle size={18} />
        <span>Add Transaction</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
              zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: 460, padding: '2rem', background: 'var(--bg-primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>New Transaction</h2>
                <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Type Toggle */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setType(t); setCategory('') }}
                    style={{
                      flex: 1, padding: '0.5rem', borderRadius: '4px', 
                      border: 'none', 
                      cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', 
                      fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
                      background: type === t ? 'var(--bg-primary)' : 'transparent',
                      color: type === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                      boxShadow: type === t ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label>Amount (₹)</label>
                  <input className="input-glass" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
                </div>
                <div>
                  <label>Category</label>
                  <select className="input-glass" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select category</option>
                    {cats.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Date</label>
                  <input className="input-glass" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                  <label>Note (optional)</label>
                  <input className="input-glass" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a brief note…" />
                </div>
                {type === 'expense' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', cursor: 'pointer', marginBottom: 0, fontWeight: 500 }}>
                    <input type="checkbox" checked={taxDeductible} onChange={(e) => setTaxDeductible(e.target.checked)} style={{ accentColor: 'var(--text-primary)', width: 16, height: 16 }} />
                    Tax Deductible
                  </label>
                )}
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
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
