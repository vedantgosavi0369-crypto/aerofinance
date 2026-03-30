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
    toast.success(`${type === 'income' ? '💰 Income' : '💸 Expense'} recorded!`)
    setAmount(''); setCategory(''); setNote(''); setTaxDeductible(false)
    setLoading(false)
    setOpen(false)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="btn-primary"
        onClick={() => setOpen(true)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#00E5FF' }}
      >
        <PlusCircle size={20} strokeWidth={3} color="#000" />
        <span style={{ color: '#000', fontWeight: 900 }}>ADD TRANSACTION</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-dark"
              style={{ width: '100%', maxWidth: 460, padding: '2rem', background: '#000', border: '4px solid #FFF', boxShadow: '8px 8px 0px #B28DFF' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', color: '#FFF' }}>Add Transaction</h2>
                <button onClick={() => setOpen(false)} style={{ background: '#FF4081', border: '2px solid #FFF', boxShadow: '2px 2px 0px #FFF', color: '#000', cursor: 'pointer', padding: '0.3rem' }}>
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Type Toggle */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#000', padding: '0.4rem', border: '3px solid #FFF', borderRadius: '0' }}>
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setType(t); setCategory('') }}
                    style={{
                      flex: 1, padding: '0.5rem', borderRadius: '0', 
                      border: type === t ? '3px solid #000' : '2px dashed #FFF', 
                      cursor: 'pointer', fontWeight: 900, fontSize: '0.9rem', 
                      fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase',
                      background: type === t ? (t === 'income' ? '#00E676' : '#FF4081') : '#000',
                      color: type === t ? '#000' : '#FFF',
                      transition: 'all 0.1s',
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
                  <input className="input-glass" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" />
                </div>
                {type === 'expense' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFF', cursor: 'pointer', marginBottom: 0, fontWeight: 800 }}>
                    <input type="checkbox" checked={taxDeductible} onChange={(e) => setTaxDeductible(e.target.checked)} style={{ accentColor: '#B28DFF', width: 18, height: 18, border: '2px solid #FFF' }} />
                    TAX DEDUCTIBLE
                  </label>
                )}
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', background: '#FFEB3B', color: '#000', fontSize: '1rem', letterSpacing: '0.05em' }}>
                  {loading ? 'SAVING…' : 'SAVE TRANSACTION'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
