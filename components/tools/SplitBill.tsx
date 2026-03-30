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
    <div className="glass-card" style={{ padding: '1.5rem', background: '#000', border: '3px solid #B28DFF', boxShadow: '4px 4px 0px #B28DFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Users size={22} color="#B28DFF" strokeWidth={3} />
        <h3 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', color: '#B28DFF' }}>Split Bill</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {people.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  className="input-glass"
                  value={p}
                  onChange={(e) => { const np = [...people]; np[i] = e.target.value; setPeople(np); setResult(null) }}
                  placeholder={`PERSON ${i + 1}`}
                />
                {people.length > 2 && (
                  <button onClick={() => { setPeople(people.filter((_, j) => j !== i)); setResult(null) }} style={{ background: '#FF4081', border: '2px solid #FFF', color: '#000', cursor: 'pointer', padding: '0.5rem' }}>
                    <Trash2 size={18} strokeWidth={3} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setPeople([...people, ''])}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'flex-start', background: '#B28DFF', color: '#000' }}
            >
              <Plus size={16} strokeWidth={3} /> ADD PERSON
            </button>
          </div>
        </div>

        {validPeople.length >= 2 && total && (
          <div style={{ padding: '1rem', background: '#000', border: '3px dashed #B28DFF', borderRadius: '0' }}>
            <p style={{ fontSize: '0.85rem', color: '#FFF', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase' }}>Each person owes</p>
            <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 900, fontSize: '2rem', color: '#B28DFF' }}>
              ₹{perPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#FFF', marginTop: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
              ₹{total} ÷ {validPeople.length} people
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <button className="btn-secondary" onClick={handleSplit}>CALCULATE SPLIT</button>
          {result && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="btn-primary"
              onClick={handlePushToLended}
              disabled={loading}
              style={{ background: '#FFEB3B', color: '#000', border: '3px solid #FFF', boxShadow: '4px 4px 0px #FFF' }}
            >
              {loading ? 'PUSHING…' : '→ PUSH TO LENDED'}
            </motion.button>
          )}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ borderTop: '3px solid #000', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#FFF', marginBottom: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Split Summary</p>
            {result.map((r) => (
              <div key={r.person} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '2px dashed #FFF' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>{r.person}</span>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 900, color: '#FFEB3B', fontSize: '1rem' }}>
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
