'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/useFinanceStore'
import { Transaction } from '@/types'
import { format } from 'date-fns'
import { Trash2, ChevronDown, ChevronUp, FileText } from 'lucide-react'

export default function TransactionList() {
  const { transactions, deleteTransaction, privacyMode } = useFinanceStore()
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [showCount, setShowCount] = useState(20)

  const filtered = transactions.filter((t) => filter === 'all' || t.type === filter)
  const visible = filtered.slice(0, showCount)

  const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', fontWeight: 500,
              background: filter === f ? 'rgba(124,106,255,0.2)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? '#a897ff' : 'rgba(232,232,240,0.5)',
              transition: 'all 0.2s',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: 'rgba(232,232,240,0.35)', fontSize: '0.8rem', alignSelf: 'center' }}>
          {filtered.length} entries
        </span>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(232,232,240,0.3)' }}>
          <FileText size={32} style={{ margin: '0 auto 0.75rem' }} />
          <p>No transactions yet</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {visible.map((t: Transaction) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="glass-card-md"
              style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                  background: t.type === 'income' ? 'rgba(6,214,160,0.15)' : 'rgba(255,107,151,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem',
                }}>
                  {t.type === 'income' ? '↑' : '↓'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem', color: '#e8e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.note || t.category}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.4)' }}>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                    <span className={`badge badge-${t.type}`}>{t.category}</span>
                    {t.tax_deductible && <span className="badge" style={{ background: 'rgba(124,106,255,0.1)', color: '#a897ff', border: '1px solid rgba(124,106,255,0.2)' }}>Tax ✓</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 700, fontSize: '1rem', color: t.type === 'income' ? '#06d6a0' : '#ff6b97' }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
                <button className="btn-danger" onClick={() => deleteTransaction(t.id)} style={{ padding: '0.3rem', borderRadius: '0.5rem' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length > showCount && (
        <button
          onClick={() => setShowCount((n) => n + 20)}
          className="btn-secondary"
          style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <ChevronDown size={15} /> Show more
        </button>
      )}
      {showCount > 20 && (
        <button
          onClick={() => setShowCount(20)}
          className="btn-secondary"
          style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <ChevronUp size={15} /> Collapse
        </button>
      )}
    </div>
  )
}
