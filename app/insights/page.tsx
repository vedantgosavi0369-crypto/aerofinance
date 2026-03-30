'use client'

import Header from '@/components/layout/Header'
import SpendingHeatmap from '@/components/insights/SpendingHeatmap'
import RainyDayPredictor from '@/components/insights/RainyDayPredictor'
import MonthlySpendingPattern from '@/components/insights/MonthlySpendingPattern'

export default function InsightsPage() {
  return (
    <div style={{ maxWidth: 900 }}>
      <Header title="Insights" />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <SpendingHeatmap />
        <MonthlySpendingPattern />
        <RainyDayPredictor />
      </div>
    </div>
  )
}
