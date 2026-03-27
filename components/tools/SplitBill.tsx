'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import toast from 'react-hot-toast'
import { Users, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

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
        note: note || `Split: ${note || total}`,
        date,
        settled: false,
      })
    }
    toast.success(`🤝 Pushed ${result.length} shares to Lended ledger`)
    setTotal(''); setPeople(['', '']); setNote(''); setResult(null); setLoading(false)
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <Users size={18} color="#a897ff" />
        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Split Bill</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Total Amount (₹)</label>
          <input className="input-glass" type="number" min="0" step="0.01" value={total} onChange={(e) => { setTotal(e.target.value); setResult(null) }} placeholder="0.00" />
        </div>
        <div>
          <label>Note (optional)</label>
          <input className="input-glass" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Dinner, Trip…" />
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
                  <button onClick={() => { setPeople(people.filter((_, j) => j !== i)); setResult(null) }} style={{ background: 'none', border: 'none', color: '#ff6b97', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setPeople([...people, ''])}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', fontSize: '0.82rem', alignSelf: 'flex-start' }}
            >
              <Plus size={13} /> Add Person
            </button>
          </div>
        </div>

        {validPeople.length >= 2 && total && (
          <div style={{ padding: '0.85rem', background: 'rgba(124,106,255,0.07)', borderRadius: '0.75rem', border: '1px solid rgba(124,106,255,0.15)' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(232,232,240,0.5)', marginBottom: '0.3rem' }}>Each person owes</p>
            <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 700, fontSize: '1.5rem', color: '#a897ff' }}>
              ₹{perPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,240,0.35)', marginTop: '0.25rem' }}>
              ₹{total} ÷ {validPeople.length} people
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={handleSplit} style={{ flex: 1 }}>Calculate Split</button>
          {result && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="btn-primary"
              onClick={handlePushToLended}
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Pushing…' : '→ Push to Lended'}
            </motion.button>
          )}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(232,232,240,0.4)', marginBottom: '0.5rem' }}>Split Summary</p>
            {result.map((r) => (
              <div key={r.person} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.88rem' }}>{r.person}</span>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, color: '#ffb347', fontSize: '0.88rem' }}>
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
