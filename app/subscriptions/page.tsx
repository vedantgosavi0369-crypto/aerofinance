'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import Header from '@/components/layout/Header'
import toast from 'react-hot-toast'
import { format, parseISO } from 'date-fns'
import { PlusCircle, RefreshCw, Pause, Play, Trash2, X } from 'lucide-react'
import { SUBSCRIPTION_CATEGORIES } from '@/types'

export default function SubscriptionsPage() {
  const { subscriptions, addSubscription, toggleSubscription, deleteSubscription, privacyMode } = useFinanceStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<'monthly' | 'weekly'>('monthly')
  const [nextDue, setNextDue] = useState(new Date().toISOString().split('T')[0])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  const totalMonthly = subscriptions.filter(s => s.active).reduce((acc, s) => acc + (s.frequency === 'monthly' ? s.amount : s.amount * 4.33), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount || !category) return toast.error('Fill in all fields')
    setLoading(true)
    await addSubscription({ name, amount: parseFloat(amount), frequency, next_due: nextDue, category, active: true })
    toast.success('Subscription added!')
    setName(''); setAmount(''); setCategory(''); setLoading(false); setOpen(false)
  }

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div style={{ maxWidth: 900 }}>
      <Header title="Subscription Pulse" />

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: '#34D8EB', opacity: 0.07, filter: 'blur(35px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Monthly Recurring</p>
            <p className={privacyMode ? 'privacy-blur' : 'gradient-text'} style={{ fontSize: '2.5rem', fontWeight: 600 }}>{fmt(totalMonthly)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.4rem 0.9rem', backdropFilter: 'blur(8px)' }}>
            <RefreshCw size={14} color="rgba(255,255,255,0.5)" />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{subscriptions.filter(s => s.active).length} active</span>
          </div>
          <button className="btn-primary" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlusCircle size={16} /> Add Subscription
          </button>
        </div>
      </motion.div>

      {subscriptions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}>
          <RefreshCw size={32} strokeWidth={1.5} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p style={{ fontWeight: 500 }}>No subscriptions yet</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.65rem' }}>
        <AnimatePresence>
          {subscriptions.map(s => (
            <motion.div key={s.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card-md"
              style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', opacity: s.active ? 1 : 0.5 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: '10px', background: s.active ? 'rgba(52,216,235,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${s.active ? 'rgba(52,216,235,0.25)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <RefreshCw size={16} color={s.active ? '#34D8EB' : 'rgba(255,255,255,0.35)'} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: '0.95rem', color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="badge" style={{ color: '#34D8EB', background: 'rgba(52,216,235,0.1)', borderColor: 'rgba(52,216,235,0.22)' }}>{s.frequency}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Due {format(parseISO(s.next_due), 'MMM d, yyyy')}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{s.category}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, color: 'rgba(255,255,255,0.88)', fontSize: '1.05rem' }}>{fmt(s.amount)}</span>
                <button className="btn-secondary" onClick={() => { toggleSubscription(s.id, !s.active); toast(s.active ? 'Paused' : 'Resumed') }} style={{ padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.82rem' }}>
                  {s.active ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button className="btn-danger" onClick={() => deleteSubscription(s.id)} style={{ width: 32, height: 32, padding: 0, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <h2 style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.92)' }}>New Subscription</h2>
                <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0.3rem', display: 'flex' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div><label>Service Name</label><input className="input-glass" value={name} onChange={e => setName(e.target.value)} placeholder="Netflix, Gym, Spotify…" required /></div>
                <div><label>Amount (₹)</label><input className="input-glass" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required /></div>
                <div>
                  <label>Frequency</label>
                  <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {(['monthly', 'weekly'] as const).map(f => (
                      <button key={f} type="button" onClick={() => setFrequency(f)} style={{
                        flex: 1, padding: '0.5rem', borderRadius: '12px', cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' as const,
                        background: frequency === f ? 'rgba(52,216,235,0.18)' : 'transparent',
                        color: frequency === f ? '#34D8EB' : 'rgba(255,255,255,0.4)',
                        border: frequency === f ? '1px solid rgba(52,216,235,0.3)' : '1px solid transparent',
                        transition: 'all 0.2s ease',
                      }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label>First Due Date</label><input className="input-glass" type="date" value={nextDue} onChange={e => setNextDue(e.target.value)} required /></div>
                <div>
                  <label>Category</label>
                  <select className="input-glass" value={category} onChange={e => setCategory(e.target.value)} required>
                    <option value="">Select…</option>
                    {SUBSCRIPTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
                  {loading ? 'Saving…' : 'Add Subscription'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
