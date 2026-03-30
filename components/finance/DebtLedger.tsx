'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { PlusCircle, Check, Trash2, UserCircle, X } from 'lucide-react'

export default function DebtLedger() {
  const { debts, addDebt, settleDebt, deleteDebt, privacyMode } = useFinanceStore()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'lended' | 'borrowed'>('lended')
  const [amount, setAmount] = useState('')
  const [person, setPerson] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [filterType, setFilterType] = useState<'all' | 'lended' | 'borrowed' | 'settled'>('all')
  const [loading, setLoading] = useState(false)

  const filtered = debts.filter((d) => {
    if (filterType === 'all') return !d.settled
    if (filterType === 'settled') return d.settled
    return d.type === filterType && !d.settled
  })

  const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !person) return toast.error('Fill in all fields')
    setLoading(true)
    await addDebt({ type, amount: parseFloat(amount), person, note: note || null, date, settled: false })
    toast.success(`${type === 'lended' ? 'Lended' : 'Borrowed'} entry recorded`)
    setAmount(''); setPerson(''); setNote(''); setLoading(false); setOpen(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Social Debt Ledger</h2>
        <button className="btn-primary" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <PlusCircle size={16} /> Add Entry
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['all', 'lended', 'borrowed', 'settled'] as const).map((f) => (
          <button key={f} onClick={() => setFilterType(f)} style={{
            padding: '0.35rem 0.9rem', borderRadius: '4px', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 500, textTransform: 'capitalize',
            background: filterType === f ? 'var(--text-primary)' : 'var(--bg-secondary)',
            color: filterType === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
            border: '1px solid ' + (filterType === f ? 'var(--text-primary)' : 'var(--border-color)'),
            transition: 'all 0.15s ease',
          }}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
          <UserCircle size={36} strokeWidth={1.5} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>No debt entries found.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AnimatePresence>
          {filtered.map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="glass-card-md"
              style={{
                padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                opacity: d.settled ? 0.6 : 1, background: 'var(--bg-primary)', borderRadius: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <UserCircle size={20} color="var(--text-secondary)" strokeWidth={1.5} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{d.person}</span>
                    <span className="badge">{d.type}</span>
                    {d.settled && <span className="badge" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Settled ✓</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {d.note && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.note}</span>}
                    {d.note && <span style={{ color: 'var(--border-color)' }}>•</span>}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{format(new Date(d.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {fmt(d.amount)}
                </span>
                {!d.settled && (
                  <button
                    className="btn-success"
                    onClick={() => { settleDebt(d.id); toast.success('Debt settled!') }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <Check size={15} /> Settle
                  </button>
                )}
                <button className="btn-danger" onClick={() => deleteDebt(d.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, padding: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: 440, padding: '2rem', background: 'var(--bg-primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>New Debt Entry</h2>
                <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                {(['lended', 'borrowed'] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: '0.5rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize',
                    background: type === t ? 'var(--bg-primary)' : 'transparent',
                    color: type === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                    boxShadow: type === t ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.15s ease',
                  }}>
                    {t}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div><label>Person / Name</label><input className="input-glass" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Alice, Bob…" required /></div>
                <div><label>Amount (₹)</label><input className="input-glass" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required /></div>
                <div><label>Date</label><input className="input-glass" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
                <div><label>Note (optional)</label><input className="input-glass" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason…" /></div>
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
                  {loading ? 'Saving…' : 'Save Entry'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
