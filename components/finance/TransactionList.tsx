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

  const filtered = transactions.filter((t) => filter === 'all' || t.type === filter)
  const visible = filtered.slice(0, showCount)

  const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 500, textTransform: 'capitalize',
              background: filter === f ? 'var(--text-primary)' : 'var(--bg-secondary)',
              color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: '1px solid ' + (filter === f ? 'var(--text-primary)' : 'var(--border-color)'),
              transition: 'all 0.15s ease',
            }}
          >
            {f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, alignSelf: 'center' }}>
          {filtered.length} entries
        </span>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
          <FileText size={32} strokeWidth={1.5} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>No transactions recorded yet.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AnimatePresence>
          {visible.map((t: Transaction) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="glass-card-md"
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', background: 'var(--bg-primary)', borderRadius: '6px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-primary)'
                }}>
                  {t.type === 'income' ? <MoveUpRight size={16} /> : <MoveDownRight size={16} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.note || t.category}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                    <span style={{ color: 'var(--border-color)' }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.category}</span>
                    {t.tax_deductible && (
                      <>
                        <span style={{ color: 'var(--border-color)' }}>•</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>Deductible</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
                <button 
                  className="btn-danger" 
                  onClick={() => deleteTransaction(t.id)} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, padding: 0 }}
                  title="Delete"
                >
                  <Trash2 size={15} />
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
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          <ChevronDown size={16} style={{ marginRight: '0.4rem' }} /> Show More
        </button>
      )}
      {showCount > 20 && (
        <button
          onClick={() => setShowCount(20)}
          className="btn-secondary"
          style={{ width: '100%', marginTop: '0.75rem' }}
        >
          <ChevronUp size={16} style={{ marginRight: '0.4rem' }} /> Collapse
        </button>
      )}
    </div>
  )
}
