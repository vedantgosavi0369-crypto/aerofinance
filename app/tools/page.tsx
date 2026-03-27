'use client'

import Header from '@/components/layout/Header'
import SplitBill from '@/components/tools/SplitBill'
import SavingsVault from '@/components/tools/SavingsVault'
import TaxExport from '@/components/tools/TaxExport'

export default function ToolsPage() {
  return (
    <div style={{ maxWidth: 1000 }}>
      <Header title="Tools" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <SplitBill />
        <SavingsVault />
        <TaxExport />
      </div>
    </div>
  )
}
