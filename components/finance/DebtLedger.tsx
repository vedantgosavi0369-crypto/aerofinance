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

  const filtered = debts.filter(d => {
    if (filterType === 'all') return !d.settled
    if (filterType === 'settled') return d.settled
    return d.type === filterType && !d.settled
  })

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !person) return toast.error('Fill in all fields')
    setLoading(true)
    await addDebt({ type, amount: parseFloat(amount), person, note: note || null, date, settled: false })
    toast.success(`${type === 'lended' ? 'Lended' : 'Borrowed'} entry saved`)
    setAmount(''); setPerson(''); setNote(''); setLoading(false); setOpen(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>Social Debt Ledger</h2>
        <button className="btn-primary" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <PlusCircle size={16} /> Add Entry
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['all', 'lended', 'borrowed', 'settled'] as const).map(f => {
          const colors: Record<string, string> = { all: 'rgba(255,255,255,0.55)', lended: '#FCD34D', borrowed: '#A78BFA', settled: '#4ADE80' }
          return (
            <button key={f} onClick={() => setFilterType(f)} style={{
              padding: '0.35rem 0.9rem', borderRadius: '999px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize',
              background: filterType === f ? `${colors[f]}18` : 'rgba(255,255,255,0.05)',
              color: filterType === f ? colors[f] : 'rgba(255,255,255,0.4)',
              border: filterType === f ? `1px solid ${colors[f]}35` : '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)', transition: 'all 0.2s ease',
            }}>
              {f}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}>
          <UserCircle size={36} strokeWidth={1.5} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>No entries found.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <AnimatePresence>
          {filtered.map(d => {
            const accent = d.type === 'lended' ? '#FCD34D' : '#A78BFA'
            return (
              <motion.div
                key={d.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                className="glass-card-md"
                style={{ padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', opacity: d.settled ? 0.55 : 1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${accent}14`, border: `1px solid ${accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <UserCircle size={19} color={accent} strokeWidth={1.5} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 500, fontSize: '0.95rem', color: 'rgba(255,255,255,0.88)' }}>{d.person}</span>
                      <span className={`badge badge-${d.type}`}>{d.type}</span>
                      {d.settled && <span className="badge" style={{ color: '#4ADE80', background: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.25)' }}>Settled ✓</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {d.note && <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{d.note}</span>}
                      {d.note && <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>}
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{format(new Date(d.date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.05rem', color: accent }}>{fmt(d.amount)}</span>
                  {!d.settled && (
                    <button className="btn-success" onClick={() => { settleDebt(d.id); toast.success('Settled!') }} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}>
                      <Check size={14} /> Settle
                    </button>
                  )}
                  <button className="btn-danger" onClick={() => deleteDebt(d.id)} style={{ width: 32, height: 32, padding: 0, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,18,0.65)', backdropFilter: 'blur(16px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="glass-dark"
              style={{ width: '100%', maxWidth: 440, padding: '2rem' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.92)' }}>New Debt Entry</h2>
                <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0.3rem', display: 'flex' }}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {(['lended', 'borrowed'] as const).map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: '0.5rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize',
                    background: type === t ? (t === 'lended' ? 'rgba(252,211,77,0.18)' : 'rgba(167,139,250,0.18)') : 'transparent',
                    color: type === t ? (t === 'lended' ? '#FCD34D' : '#A78BFA') : 'rgba(255,255,255,0.4)',
                    border: type === t ? `1px solid ${t === 'lended' ? 'rgba(252,211,77,0.3)' : 'rgba(167,139,250,0.3)'}` : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}>
                    {t}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div><label>Person / Name</label><input className="input-glass" value={person} onChange={e => setPerson(e.target.value)} placeholder="Alice, Bob…" required /></div>
                <div><label>Amount (₹)</label><input className="input-glass" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required /></div>
                <div><label>Date</label><input className="input-glass" type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
                <div><label>Note (optional)</label><input className="input-glass" value={note} onChange={e => setNote(e.target.value)} placeholder="Reason…" /></div>
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
