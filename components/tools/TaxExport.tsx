'use client'

import { useFinanceStore } from '@/store/useFinanceStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Download, FileText } from 'lucide-react'

export default function TaxExport() {
  const { transactions } = useFinanceStore()

  const taxable = transactions.filter((t) => t.tax_deductible && t.type === 'expense')
  const total = taxable.reduce((acc, t) => acc + t.amount, 0)

  // Group by category
  const byCategory = taxable.reduce<Record<string, typeof taxable>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})

  const handleExport = () => {
    if (taxable.length === 0) return toast.error('No tax-deductible expenses found')

    const rows = [
      ['Date', 'Category', 'Description', 'Amount (INR)', 'Type'],
      ...Object.entries(byCategory).flatMap(([cat, txns]) =>
        txns.map((t) => [
          format(new Date(t.date), 'yyyy-MM-dd'),
          cat,
          t.note || cat,
          t.amount.toFixed(2),
          'Expense',
        ])
      ),
    ]

    const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aerofinance-tax-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('📄 CSV exported!')
  }

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="glass-card" style={{ padding: '1.5rem', background: '#000', border: '3px solid #00E676', boxShadow: '4px 4px 0px #00E676' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <FileText size={22} color="#00E676" strokeWidth={3} />
        <h3 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', color: '#00E676' }}>Tax Export Engine</h3>
      </div>

      <div style={{ padding: '1rem', background: '#000', border: '3px dashed #00E676', borderRadius: '0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.85rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', fontWeight: 800 }}>Tax Deductible Total</p>
          <p style={{ fontWeight: 900, fontSize: '2rem', color: '#00E676' }}>{fmt(total)}</p>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 700, textTransform: 'uppercase' }}>{taxable.length} DEDUCTIBLE ENTRIES</p>
      </div>

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 ? (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>By Category</p>
          {Object.entries(byCategory).map(([cat, txns]) => {
            const catTotal = txns.reduce((a, t) => a + t.amount, 0)
            const pct = total > 0 ? (catTotal / total) * 100 : 0
            return (
              <div key={cat} style={{ background: '#000', border: '2px solid #FFF', padding: '0.75rem', borderRadius: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>{cat}</span>
                  <span style={{ fontSize: '0.9rem', color: '#00E676', fontWeight: 900 }}>{fmt(catTotal)}</span>
                </div>
                <div style={{ height: 12, background: '#000', border: '2px solid #FFF', borderRadius: 0, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#00E676', borderRadius: 0, borderRight: '2px solid #FFF' }} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#FFF', fontSize: '0.85rem', padding: '1rem', marginBottom: '1.5rem', border: '2px dashed #FFF', fontWeight: 800, textTransform: 'uppercase' }}>
          Mark expenses as "TAX DEDUCTIBLE" in the Ledger to see them here.
        </p>
      )}

      <button className="btn-primary" onClick={handleExport} disabled={taxable.length === 0} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: taxable.length === 0 ? 0.5 : 1, background: '#00E676', color: '#000', fontSize: '1rem', letterSpacing: '0.05em' }}>
        <Download size={18} strokeWidth={3} /> DOWNLOAD CSV
      </button>
    </div>
  )
}
