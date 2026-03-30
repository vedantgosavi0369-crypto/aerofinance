'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import { Transaction } from '@/types'
import { format } from 'date-fns'
import { Trash2, ChevronDown, ChevronUp, FileText, MoveUpRight, MoveDownRight } from 'lucide-react'

export default function TransactionList() {
  const { transactions, deleteTransaction, privacyMode } = useFinanceStore()
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [showCount, setShowCount] = useState(20)

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter)
  const visible = filtered.slice(0, showCount)
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {(['all', 'income', 'expense'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.4rem 1rem', borderRadius: '999px',
            fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize', cursor: 'pointer',
            background: filter === f ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.05)',
            color: filter === f ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.4)',
            border: filter === f ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            boxShadow: filter === f ? 'inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
            transition: 'all 0.2s ease',
          }}>
            {f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', alignSelf: 'center' }}>{filtered.length} entries</span>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}>
          <FileText size={32} strokeWidth={1.5} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>No transactions yet</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <AnimatePresence>
          {visible.map((t: Transaction) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 10 }}
              className="glass-card-md"
              style={{ padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: t.type === 'income' ? 'rgba(74,222,128,0.12)' : 'rgba(251,113,133,0.12)',
                  border: `1px solid ${t.type === 'income' ? 'rgba(74,222,128,0.25)' : 'rgba(251,113,133,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {t.type === 'income' ? <MoveUpRight size={16} color="#4ADE80" /> : <MoveDownRight size={16} color="#FB7185" />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: '0.95rem', color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.note || t.category}
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>•</span>
                    <span className={`badge badge-${t.type}`}>{t.category}</span>
                    {t.tax_deductible && <span className="badge" style={{ color: '#5B9BFF', background: 'rgba(91,155,255,0.12)', borderColor: 'rgba(91,155,255,0.25)' }}>Deductible</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.05rem', color: t.type === 'income' ? '#4ADE80' : '#FB7185' }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
                <button className="btn-danger" onClick={() => deleteTransaction(t.id)} style={{ width: 32, height: 32, padding: 0, borderRadius: '8px' }} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length > showCount && (
        <button onClick={() => setShowCount(n => n + 20)} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
          <ChevronDown size={15} style={{ marginRight: '0.3rem' }} /> Show More
        </button>
      )}
      {showCount > 20 && (
        <button onClick={() => setShowCount(20)} className="btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
          <ChevronUp size={15} style={{ marginRight: '0.3rem' }} /> Collapse
        </button>
      )}
    </div>
  )
}
