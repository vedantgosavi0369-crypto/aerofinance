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
    toast.success(`${type === 'lended' ? '🤝 Lended' : '💳 Borrowed'} recorded`)
    setAmount(''); setPerson(''); setNote(''); setLoading(false); setOpen(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>Social Debt Ledger</h2>
        <button className="btn-primary" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <PlusCircle size={14} /> Add Entry
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['all', 'lended', 'borrowed', 'settled'] as const).map((f) => (
          <button key={f} onClick={() => setFilterType(f)} style={{
            padding: '0.35rem 0.85rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem', fontWeight: 500,
            background: filterType === f ? 'rgba(124,106,255,0.2)' : 'rgba(255,255,255,0.05)',
            color: filterType === f ? '#a897ff' : 'rgba(232,232,240,0.5)',
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(232,232,240,0.3)' }}>
          <UserCircle size={32} style={{ margin: '0 auto 0.75rem' }} />
          <p>No debt entries</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {filtered.map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="glass-card-md"
              style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', opacity: d.settled ? 0.5 : 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: d.type === 'lended' ? 'rgba(255,179,71,0.15)' : 'rgba(124,106,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <UserCircle size={18} color={d.type === 'lended' ? '#ffb347' : '#a897ff'} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.person}</span>
                    <span className={`badge badge-${d.type}`}>{d.type}</span>
                    {d.settled && <span className="badge" style={{ background: 'rgba(6,214,160,0.1)', color: '#06d6a0', border: '1px solid rgba(6,214,160,0.2)' }}>Settled ✓</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                    {d.note && <span style={{ fontSize: '0.75rem', color: 'rgba(232,232,240,0.45)' }}>{d.note}</span>}
                    <span style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.35)' }}>{format(new Date(d.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 700, fontSize: '1rem', color: d.type === 'lended' ? '#ffb347' : '#a897ff' }}>
                  {fmt(d.amount)}
                </span>
                {!d.settled && (
                  <button className="btn-success" onClick={() => { settleDebt(d.id); toast.success('Debt settled!') }} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Check size={13} /> Settle
                  </button>
                )}
                <button className="btn-danger" onClick={() => deleteDebt(d.id)} style={{ padding: '0.3rem', borderRadius: '0.5rem' }}>
                  <Trash2 size={14} />
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
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-dark"
              style={{ width: '100%', maxWidth: 440, padding: '2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>Add Debt Entry</h2>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(232,232,240,0.5)', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.04)', padding: '0.3rem', borderRadius: '0.75rem' }}>
                {(['lended', 'borrowed'] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: '0.5rem', borderRadius: '0.55rem', border: 'none', cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 600,
                    background: type === t ? (t === 'lended' ? 'rgba(255,179,71,0.2)' : 'rgba(124,106,255,0.2)') : 'transparent',
                    color: type === t ? (t === 'lended' ? '#ffb347' : '#a897ff') : 'rgba(232,232,240,0.5)',
                    transition: 'all 0.2s',
                  }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
