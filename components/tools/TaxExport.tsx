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
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <FileText size={18} color="#06d6a0" />
        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Tax Export Engine</h3>
      </div>

      <div style={{ padding: '1rem', background: 'rgba(6,214,160,0.06)', borderRadius: '0.75rem', border: '1px solid rgba(6,214,160,0.12)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <p style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Tax Deductible Total</p>
          <p style={{ fontWeight: 700, fontSize: '1.4rem', color: '#06d6a0' }}>{fmt(total)}</p>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'rgba(232,232,240,0.4)' }}>{taxable.length} deductible entries</p>
      </div>

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 ? (
        <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(232,232,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>By Category</p>
          {Object.entries(byCategory).map(([cat, txns]) => {
            const catTotal = txns.reduce((a, t) => a + t.amount, 0)
            const pct = total > 0 ? (catTotal / total) * 100 : 0
            return (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.82rem' }}>{cat}</span>
                  <span style={{ fontSize: '0.82rem', color: '#06d6a0', fontWeight: 600 }}>{fmt(catTotal)}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #06d6a080, #06d6a0)', borderRadius: 999 }} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'rgba(232,232,240,0.3)', fontSize: '0.85rem', padding: '1rem', marginBottom: '1rem' }}>
          Mark expenses as "Tax Deductible" in the Ledger to see them here.
        </p>
      )}

      <button className="btn-primary" onClick={handleExport} disabled={taxable.length === 0} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: taxable.length === 0 ? 0.5 : 1 }}>
        <Download size={15} /> Download CSV
      </button>
    </div>
  )
}
