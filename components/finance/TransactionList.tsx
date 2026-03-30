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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1.2rem', borderRadius: '0', border: '3px solid #FFF', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase',
              background: filter === f ? '#00E5FF' : '#000',
              color: filter === f ? '#000' : '#FFF',
              boxShadow: filter === f ? '3px 3px 0px #FFF' : '1px 1px 0px #FFF',
              transition: 'all 0.1s',
            }}
          >
            {f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: '#FFF', fontSize: '0.85rem', fontWeight: 800, alignSelf: 'center', textTransform: 'uppercase' }}>
          {filtered.length} entries
        </span>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#FFF', border: '3px dashed #FFF', background: '#000' }}>
          <FileText size={40} style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 800, textTransform: 'uppercase' }}>No transactions yet</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {visible.map((t: Transaction) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="glass-card-md"
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', background: '#000' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '0', flexShrink: 0,
                  background: t.type === 'income' ? '#00E676' : '#FF4081',
                  border: '3px solid #FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', fontWeight: 900, color: '#000',
                  boxShadow: '2px 2px 0px #FFF'
                }}>
                  {t.type === 'income' ? '↑' : '↓'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase' }}>
                    {t.note || t.category}
                  </p>
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 700, borderBottom: '2px solid #FFF' }}>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                    <span className={`badge badge-${t.type}`}>{t.category}</span>
                    {t.tax_deductible && <span className="badge" style={{ background: '#B28DFF', color: '#000', border: '2px solid #FFF', boxShadow: '2px 2px 0px #FFF' }}>TAX ✓</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 900, fontSize: '1.2rem', color: t.type === 'income' ? '#00E676' : '#FF4081', display: 'flex', alignItems: 'center' }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
                <button 
                  className="btn-danger" 
                  onClick={() => deleteTransaction(t.id)} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, padding: 0 }}
                >
                  <Trash2 size={16} strokeWidth={3} />
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
          style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#FFEB3B', color: '#000' }}
        >
          <ChevronDown size={18} strokeWidth={3} /> SHOW MORE
        </button>
      )}
      {showCount > 20 && (
        <button
          onClick={() => setShowCount(20)}
          className="btn-secondary"
          style={{ width: '100%', marginTop: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#FFF', color: '#000' }}
        >
          <ChevronUp size={18} strokeWidth={3} /> COLLAPSE
        </button>
      )}
    </div>
  )
}
