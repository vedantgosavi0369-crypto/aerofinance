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
    toast.success('Subscription added!')
    setName(''); setAmount(''); setCategory(''); setLoading(false); setOpen(false)
  }

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div style={{ maxWidth: 900 }}>
      <Header title="Subscription Pulse" />

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '1.5rem', marginBottom: '1.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>
              Monthly Recurring Cost
            </p>
            <p
              className={privacyMode ? 'privacy-blur' : ''}
              style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              {fmt(totalMonthly)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} color="var(--text-secondary)" strokeWidth={2} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {subscriptions.filter((s) => s.active).length} active
            </span>
          </div>
          <button className="btn-primary" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlusCircle size={16} /> Add Subscription
          </button>
        </div>
      </motion.div>

      {/* List */}
      {subscriptions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
          <RefreshCw size={32} strokeWidth={1.5} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>No subscriptions yet</p>
        </div>
      )}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <AnimatePresence>
          {subscriptions.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card-md"
              style={{
                padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                justifyContent: 'space-between', opacity: s.active ? 1 : 0.5, borderRadius: '6px',
                background: 'var(--bg-primary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '8px', background: s.active ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <RefreshCw size={17} color="var(--text-primary)" strokeWidth={2} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{s.name}</p>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="badge">{s.frequency}</span>
                    <span style={{ color: 'var(--border-color)' }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Due {format(parseISO(s.next_due), 'MMM d, yyyy')}</span>
                    <span style={{ color: 'var(--border-color)' }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.category}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{fmt(s.amount)}</span>
                <button className="btn-secondary" onClick={() => { toggleSubscription(s.id, !s.active); toast(s.active ? 'Paused' : 'Resumed') }} style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {s.active ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button className="btn-danger" onClick={() => deleteSubscription(s.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, padding: 0 }}>
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
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>New Subscription</h2>
                <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div><label>Service Name</label><input className="input-glass" value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix, Gym, Spotify…" required /></div>
                <div><label>Amount (₹)</label><input className="input-glass" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required /></div>
                <div>
                  <label>Frequency</label>
                  <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    {(['monthly', 'weekly'] as const).map((f) => (
                      <button key={f} type="button" onClick={() => setFrequency(f)} style={{
                        flex: 1, padding: '0.5rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize',
                        background: frequency === f ? 'var(--bg-primary)' : 'transparent',
                        color: frequency === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                        boxShadow: frequency === f ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.15s ease'
                      }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label>First Due Date</label><input className="input-glass" type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} required /></div>
                <div><label>Category</label>
                  <select className="input-glass" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select…</option>
                    {SUBSCRIPTION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
