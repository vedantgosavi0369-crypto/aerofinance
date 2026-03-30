'use client'

import { useFinanceStore } from '@/store/useFinanceStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Download, FileText } from 'lucide-react'

export default function TaxExport() {
  const { transactions } = useFinanceStore()

  const taxable = transactions.filter((t) => t.tax_deductible && t.type === 'expense')
  const total = taxable.reduce((acc, t) => acc + t.amount, 0)

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
    toast.success('CSV exported!')
  }

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <FileText size={20} color="var(--text-primary)" strokeWidth={2} />
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Tax Export Engine</h3>
      </div>

      <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>Tax Deductible Total</p>
          <p style={{ fontWeight: 600, fontSize: '1.75rem', color: 'var(--text-primary)' }}>{fmt(total)}</p>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{taxable.length} deductible entries</p>
      </div>

      {Object.keys(byCategory).length > 0 ? (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>By Category</p>
          {Object.entries(byCategory).map(([cat, txns]) => {
            const catTotal = txns.reduce((a, t) => a + t.amount, 0)
            const pct = total > 0 ? (catTotal / total) * 100 : 0
            return (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{cat}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{fmt(catTotal)}</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: '3px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--text-primary)', borderRadius: '3px' }} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '1rem', marginBottom: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
          Mark expenses as "Tax Deductible" in the Ledger to see them here.
        </p>
      )}

      <button
        className="btn-primary"
        onClick={handleExport}
        disabled={taxable.length === 0}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: taxable.length === 0 ? 0.4 : 1 }}
      >
        <Download size={17} /> Download CSV
      </button>
    </div>
  )
}
