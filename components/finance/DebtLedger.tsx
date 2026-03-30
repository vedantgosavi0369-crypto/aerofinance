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
        <h2 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase' }}>Social Debt Ledger</h2>
        <button className="btn-primary" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.9rem', background: '#00E5FF' }}>
          <PlusCircle size={16} strokeWidth={3} /> ADD ENTRY
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['all', 'lended', 'borrowed', 'settled'] as const).map((f) => (
          <button key={f} onClick={() => setFilterType(f)} style={{
            padding: '0.4rem 1rem', borderRadius: '0', border: '3px solid #FFF', cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase',
            background: filterType === f ? '#FFEB3B' : '#000',
            color: filterType === f ? '#000' : '#FFF',
            boxShadow: filterType === f ? '3px 3px 0px #FFF' : '1px 1px 0px #FFF',
            transition: 'all 0.1s',
          }}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: '#FFF', border: '3px dashed #FFF' }}>
          <UserCircle size={40} strokeWidth={2} style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 800, textTransform: 'uppercase' }}>No debt entries</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {filtered.map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="glass-card-md"
              style={{
                padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                opacity: d.settled ? 0.6 : 1, filter: d.settled ? 'grayscale(0.8)' : 'none', background: '#000'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '0', flexShrink: 0,
                  background: d.type === 'lended' ? '#FFEB3B' : '#B28DFF', border: '3px solid #FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #FFF'
                }}>
                  <UserCircle size={22} color="#000" strokeWidth={3} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#FFF', textTransform: 'uppercase' }}>{d.person}</span>
                    <span className={`badge badge-${d.type}`}>{d.type}</span>
                    {d.settled && <span className="badge" style={{ background: '#000', color: '#00E676', border: '2px solid #00E676' }}>SETTLED ✓</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {d.note && <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 600 }}>{d.note}</span>}
                    <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 700, borderBottom: '2px solid #FFF' }}>{format(new Date(d.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 900, fontSize: '1.2rem', color: d.type === 'lended' ? '#FFEB3B' : '#B28DFF' }}>
                  {fmt(d.amount)}
                </span>
                {!d.settled && (
                  <button className="btn-success" onClick={() => { settleDebt(d.id); toast.success('Debt settled!') }} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', height: 36, borderRadius: 0, border: '3px solid #000' }}>
                    <Check size={16} strokeWidth={3} /> <span>SETTLE</span>
                  </button>
                )}
                <button className="btn-danger" onClick={() => deleteDebt(d.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, padding: 0 }}>
                  <Trash2 size={16} strokeWidth={3} />
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
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-dark"
              style={{ width: '100%', maxWidth: 440, padding: '2rem', background: '#000', border: '4px solid #FFF', boxShadow: '8px 8px 0px #FFEB3B' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', color: '#FFF' }}>Add Debt Entry</h2>
                <button onClick={() => setOpen(false)} style={{ background: '#FF4081', border: '2px solid #FFF', boxShadow: '2px 2px 0px #FFF', color: '#000', cursor: 'pointer', padding: '0.3rem' }}>
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#000', border: '3px solid #FFF', padding: '0.4rem' }}>
                {(['lended', 'borrowed'] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: '0.5rem', border: type === t ? '3px solid #000' : '2px dashed #FFF', cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase',
                    background: type === t ? (t === 'lended' ? '#FFEB3B' : '#B28DFF') : '#000',
                    color: type === t ? '#000' : '#FFF',
                    transition: 'all 0.1s',
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
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', background: '#00E676', color: '#000', fontSize: '1rem', letterSpacing: '0.05em' }}>
                  {loading ? 'SAVING…' : 'SAVE ENTRY'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
