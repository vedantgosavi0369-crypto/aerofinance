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
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#000', border: '3px solid #FFEB3B', boxShadow: '4px 4px 0px #FFEB3B' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', fontWeight: 800 }}>
              Monthly Recurring Cost
            </p>
            <p className={privacyMode ? 'privacy-blur' : 'gradient-text'} style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFEB3B', textShadow: '2px 2px 0px #FFF' }}>{fmt(totalMonthly)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#000', border: '2px dashed #FFF', padding: '0.5rem 0.8rem' }}>
            <RefreshCw size={20} color="#FFEB3B" strokeWidth={3} />
            <span style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>{subscriptions.filter((s) => s.active).length} active</span>
          </div>
          <button className="btn-primary" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFEB3B', color: '#000', fontSize: '0.95rem' }}>
            <PlusCircle size={18} strokeWidth={3} /> ADD SUBSCRIPTION
          </button>
        </div>
      </motion.div>

      {/* List */}
      {subscriptions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#FFF', border: '3px dashed #FFF', background: '#000' }}>
          <RefreshCw size={40} strokeWidth={2} style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 800, textTransform: 'uppercase' }}>No subscriptions yet</p>
        </div>
      )}
      <div style={{ display: 'grid', gap: '1rem' }}>
        <AnimatePresence>
          {subscriptions.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card-md"
              style={{
                padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between',
                opacity: s.active ? 1 : 0.6, filter: s.active ? 'none' : 'grayscale(0.8)', background: '#000'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: '0', background: s.active ? '#FF4081' : '#333', border: '3px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '2px 2px 0px #FFF' }}>
                  <RefreshCw size={20} color={s.active ? '#000' : '#FFF'} strokeWidth={3} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 900, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase', color: '#FFF' }}>{s.name}</p>
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="badge" style={{ background: '#000', color: '#FF4081', border: '2px solid #FF4081', boxShadow: '2px 2px 0px #FF4081' }}>{s.frequency.toUpperCase()}</span>
                    <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 800, borderLeft: '2px solid #FFF', paddingLeft: '0.6rem' }}>Next: {format(parseISO(s.next_due), 'MMM d, yyyy')}</span>
                    <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 800, borderLeft: '2px solid #FFF', paddingLeft: '0.6rem', textTransform: 'uppercase' }}>{s.category}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 900, color: '#FF4081', fontSize: '1.3rem' }}>{fmt(s.amount)}</span>
                <button className="btn-secondary" onClick={() => { toggleSubscription(s.id, !s.active); toast(s.active ? '⏸ Paused' : '▶ Resumed') }} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#FFF', color: '#000', borderRadius: '0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {s.active ? <Pause size={16} strokeWidth={3} /> : <Play size={16} strokeWidth={3} />}
                </button>
                <button className="btn-danger" onClick={() => deleteSubscription(s.id)} style={{ padding: '0.4rem', borderRadius: '0', border: '3px solid #000', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="glass-dark" style={{ width: '100%', maxWidth: 460, padding: '2rem', background: '#000', border: '4px solid #FFF', boxShadow: '8px 8px 0px #00E5FF' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', color: '#FFF' }}>New Subscription</h2>
                <button onClick={() => setOpen(false)} style={{ background: '#FF4081', border: '2px solid #FFF', boxShadow: '2px 2px 0px #FFF', color: '#000', cursor: 'pointer', padding: '0.3rem' }}><X size={20} strokeWidth={3} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div><label>Service Name</label><input className="input-glass" value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix, Gym, Spotify…" required /></div>
                <div><label>Amount (₹)</label><input className="input-glass" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required /></div>
                <div>
                  <label>Frequency</label>
                  <div style={{ display: 'flex', gap: '0.5rem', background: '#000', padding: '0.4rem', border: '3px solid #FFF', borderRadius: '0' }}>
                    {(['monthly', 'weekly'] as const).map((f) => (
                      <button key={f} type="button" onClick={() => setFrequency(f)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0', border: frequency === f ? '3px solid #000' : '2px dashed #FFF', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', background: frequency === f ? '#00E5FF' : '#000', color: frequency === f ? '#000' : '#FFF', transition: 'all 0.1s' }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label>First Due Date</label><input className="input-glass" type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} required /></div>
                <div><label>Category</label><select className="input-glass" value={category} onChange={(e) => setCategory(e.target.value)} required><option value="">Select…</option>{SUBSCRIPTION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', background: '#00E676', color: '#000', fontSize: '1rem', letterSpacing: '0.05em' }}>{loading ? 'SAVING…' : 'ADD SUBSCRIPTION'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
