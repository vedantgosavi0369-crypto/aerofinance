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

  const validPeople = people.filter(p => p.trim().length > 0)
  const perPerson = validPeople.length > 0 ? parseFloat(total || '0') / validPeople.length : 0

  const handleSplit = () => {
    if (!total || validPeople.length < 2) return toast.error('Enter amount and at least 2 people')
    setResult(validPeople.map(p => ({ person: p.trim(), share: perPerson })))
  }

  const handlePushToLended = async () => {
    if (!result) return
    setLoading(true)
    for (const r of result) await addDebt({ type: 'lended', amount: r.share, person: r.person, note: note || 'Split bill', date, settled: false })
    toast.success(`Pushed ${result.length} shares to ledger`)
    setTotal(''); setPeople(['', '']); setNote(''); setResult(null); setLoading(false)
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: '#A78BFA', opacity: 0.06, filter: 'blur(25px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={18} color="#A78BFA" />
        </div>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>Split Bill</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div><label>Total Amount (₹)</label><input className="input-glass" type="number" min="0" step="0.01" value={total} onChange={e => { setTotal(e.target.value); setResult(null) }} placeholder="0.00" /></div>
        <div><label>Note (optional)</label><input className="input-glass" value={note} onChange={e => setNote(e.target.value)} placeholder="Dinner, trip…" /></div>

        <div>
          <label>People</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {people.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input className="input-glass" value={p} onChange={e => { const np = [...people]; np[i] = e.target.value; setPeople(np); setResult(null) }} placeholder={`Person ${i + 1}`} />
                {people.length > 2 && (
                  <button onClick={() => { setPeople(people.filter((_, j) => j !== i)); setResult(null) }} className="btn-danger" style={{ display: 'flex', alignItems: 'center', padding: '0.45rem', flexShrink: 0, borderRadius: '10px' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setPeople([...people, ''])} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', alignSelf: 'flex-start', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              <Plus size={14} /> Add Person
            </button>
          </div>
        </div>

        {validPeople.length >= 2 && total && (
          <div style={{ padding: '1rem', background: 'rgba(167,139,250,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '14px' }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem' }}>Each person owes</p>
            <p className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.9rem', color: '#A78BFA' }}>
              ₹{perPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem' }}>₹{total} ÷ {validPeople.length} people</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.6rem', flexDirection: 'column' }}>
          <button className="btn-secondary" onClick={handleSplit}>Calculate Split</button>
          {result && (
            <motion.button initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="btn-primary" onClick={handlePushToLended} disabled={loading}
              style={{ background: 'rgba(167,139,250,0.18)', borderColor: 'rgba(167,139,250,0.35)', color: '#A78BFA' }}>
              {loading ? 'Pushing…' : '→ Push to Lended Ledger'}
            </motion.button>
          )}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>Split Summary</p>
            {result.map(r => (
              <div key={r.person} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{r.person}</span>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, color: '#A78BFA' }}>₹{r.share.toFixed(2)}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
