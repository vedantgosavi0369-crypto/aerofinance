'use client'

import Header from '@/components/layout/Header'
import TransactionForm from '@/components/finance/TransactionForm'
import TransactionList from '@/components/finance/TransactionList'
import DebtLedger from '@/components/finance/DebtLedger'

export default function LedgerPage() {
  return (
    <div style={{ maxWidth: 900 }}>
      <Header title="Ledger" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <TransactionForm />
      </div>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>Transactions</h2>
          <TransactionList />
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <DebtLedger />
        </div>
      </div>
    </div>
  )
}
