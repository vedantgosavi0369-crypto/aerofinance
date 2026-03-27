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

  const totalMonthly = subscriptions
    .filter((s) => s.active)
    .reduce((acc, s) => acc + (s.frequency === 'monthly' ? s.amount : s.amount * 4.33), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount || !category) return toast.error('Fill in all fields')
    setLoading(true)
    await addSubscription({ name, amount: parseFloat(amount), frequency, next_due: nextDue, category, active: true })
    toast.success('📅 Subscription added!')
    setName(''); setAmount(''); setCategory(''); setLoading(false); setOpen(false)
  }

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div style={{ maxWidth: 900 }}>
      <Header title="Subscription Pulse" />

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(124,106,255,0.08), rgba(6,214,160,0.04))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,240,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
              Monthly Recurring Cost
            </p>
            <p className={privacyMode ? 'privacy-blur' : 'gradient-text'} style={{ fontSize: '2.2rem', fontWeight: 800 }}>{fmt(totalMonthly)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} color="#a897ff" />
            <span style={{ color: 'rgba(232,232,240,0.5)', fontSize: '0.85rem' }}>{subscriptions.filter((s) => s.active).length} active subscriptions</span>
          </div>
          <button className="btn-primary" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlusCircle size={15} /> Add Subscription
          </button>
        </div>
      </motion.div>

      {/* List */}
      {subscriptions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(232,232,240,0.3)' }}>
          <RefreshCw size={32} style={{ margin: '0 auto 0.75rem' }} />
          <p>No subscriptions yet</p>
        </div>
      )}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <AnimatePresence>
          {subscriptions.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card-md"
              style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', opacity: s.active ? 1 : 0.5 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: s.active ? 'rgba(124,106,255,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <RefreshCw size={16} color={s.active ? '#a897ff' : 'rgba(232,232,240,0.3)'} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'rgba(124,106,255,0.1)', color: '#a897ff', border: '1px solid rgba(124,106,255,0.2)' }}>{s.frequency}</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.35)' }}>Next: {format(parseISO(s.next_due), 'MMM d, yyyy')}</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.35)' }}>{s.category}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 700, color: '#a897ff' }}>{fmt(s.amount)}</span>
                <button className="btn-secondary" onClick={() => { toggleSubscription(s.id, !s.active); toast(s.active ? '⏸ Paused' : '▶ Resumed') }} style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}>
                  {s.active ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button className="btn-danger" onClick={() => deleteSubscription(s.id)} style={{ padding: '0.3rem', borderRadius: '0.5rem' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="glass-dark" style={{ width: '100%', maxWidth: 440, padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>New Subscription</h2>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(232,232,240,0.5)', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label>Service Name</label><input className="input-glass" value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix, Gym, Spotify…" required /></div>
                <div><label>Amount (₹)</label><input className="input-glass" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required /></div>
                <div>
                  <label>Frequency</label>
                  <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.3rem', borderRadius: '0.75rem' }}>
                    {(['monthly', 'weekly'] as const).map((f) => (
                      <button key={f} type="button" onClick={() => setFrequency(f)} style={{ flex: 1, padding: '0.45rem', borderRadius: '0.55rem', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 600, background: frequency === f ? 'rgba(124,106,255,0.2)' : 'transparent', color: frequency === f ? '#a897ff' : 'rgba(232,232,240,0.5)', transition: 'all 0.2s' }}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label>First Due Date</label><input className="input-glass" type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} required /></div>
                <div><label>Category</label><select className="input-glass" value={category} onChange={(e) => setCategory(e.target.value)} required><option value="">Select…</option>{SUBSCRIPTION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>{loading ? 'Saving…' : 'Add Subscription'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
