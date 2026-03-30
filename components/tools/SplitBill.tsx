'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import toast from 'react-hot-toast'
import { Users, Plus, Trash2 } from 'lucide-react'

export default function SplitBill() {
  const { addDebt, privacyMode } = useFinanceStore()
  const [total, setTotal] = useState('')
  const [people, setPeople] = useState<string[]>(['', ''])
  const [note, setNote] = useState('')
  const [date] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ person: string; share: number }[] | null>(null)

  const validPeople = people.filter((p) => p.trim().length > 0)
  const perPerson = validPeople.length > 0 ? parseFloat(total || '0') / validPeople.length : 0

  const handleSplit = () => {
    if (!total || validPeople.length < 2) return toast.error('Enter amount and at least 2 people')
    setResult(validPeople.map((p) => ({ person: p.trim(), share: perPerson })))
  }

  const handlePushToLended = async () => {
    if (!result) return
    setLoading(true)
    for (const r of result) {
      await addDebt({
        type: 'lended',
        amount: r.share,
        person: r.person,
        note: note || `Split bill`,
        date,
        settled: false,
      })
    }
    toast.success(`Pushed ${result.length} shares to Lended ledger`)
    setTotal(''); setPeople(['', '']); setNote(''); setResult(null); setLoading(false)
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Users size={20} color="var(--text-primary)" strokeWidth={2} />
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Split Bill</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label>Total Amount (₹)</label>
          <input className="input-glass" type="number" min="0" step="0.01" value={total} onChange={(e) => { setTotal(e.target.value); setResult(null) }} placeholder="0.00" />
        </div>
        <div>
          <label>Note (optional)</label>
          <input className="input-glass" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Dinner, trip…" />
        </div>
        <div>
          <label>People</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {people.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  className="input-glass"
                  value={p}
                  onChange={(e) => { const np = [...people]; np[i] = e.target.value; setPeople(np); setResult(null) }}
                  placeholder={`Person ${i + 1}`}
                />
                {people.length > 2 && (
                  <button
                    onClick={() => { setPeople(people.filter((_, j) => j !== i)); setResult(null) }}
                    className="btn-danger"
                    style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', flexShrink: 0 }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setPeople([...people, ''])}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'flex-start', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              <Plus size={15} /> Add Person
            </button>
          </div>
        </div>

        {validPeople.length >= 2 && total && (
          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Each person owes</p>
            <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.75rem', color: 'var(--text-primary)' }}>
              ₹{perPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              ₹{total} ÷ {validPeople.length} people
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <button className="btn-secondary" onClick={handleSplit}>Calculate Split</button>
          {result && (
            <motion.button
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="btn-primary"
              onClick={handlePushToLended}
              disabled={loading}
            >
              {loading ? 'Pushing…' : '→ Push to Lended Ledger'}
            </motion.button>
          )}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 500 }}>Split Summary</p>
            {result.map((r) => (
              <div key={r.person} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>{r.person}</span>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  ₹{r.share.toFixed(2)}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
