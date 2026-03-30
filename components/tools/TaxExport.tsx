'use client'

import { useFinanceStore } from '@/store/useFinanceStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Download, FileText } from 'lucide-react'

export default function TaxExport() {
  const { transactions } = useFinanceStore()
  const taxable = transactions.filter(t => t.tax_deductible && t.type === 'expense')
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
        txns.map(t => [format(new Date(t.date), 'yyyy-MM-dd'), cat, t.note || cat, t.amount.toFixed(2), 'Expense'])
      ),
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
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
    <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: '#4ADE80', opacity: 0.06, filter: 'blur(25px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={18} color="#4ADE80" />
        </div>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>Tax Export Engine</h3>
      </div>

      <div style={{ padding: '1.25rem', background: 'rgba(74,222,128,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Tax Deductible Total</p>
          <p style={{ fontWeight: 600, fontSize: '1.9rem', color: '#4ADE80' }}>{fmt(total)}</p>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>{taxable.length} deductible entries</p>
      </div>

      {Object.keys(byCategory).length > 0 ? (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>By Category</p>
          {Object.entries(byCategory).map(([cat, txns]) => {
            const catTotal = txns.reduce((a, t) => a + t.amount, 0)
            const pct = total > 0 ? (catTotal / total) * 100 : 0
            return (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{cat}</span>
                  <span style={{ fontSize: '0.875rem', color: '#4ADE80' }}>{fmt(catTotal)}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, rgba(74,222,128,0.6), #4ADE80)', borderRadius: '999px', boxShadow: '0 0 8px rgba(74,222,128,0.4)' }} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', padding: '1rem', marginBottom: '1.5rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          Mark expenses as "Tax Deductible" in the Ledger to see them here.
        </p>
      )}

      <button className="btn-primary" onClick={handleExport} disabled={taxable.length === 0} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', opacity: taxable.length === 0 ? 0.4 : 1, background: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.3)', color: '#4ADE80' }}>
        <Download size={17} /> Download CSV
      </button>
    </div>
  )
}
