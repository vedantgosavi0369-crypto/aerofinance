'use client'

import { useMemo, useState } from 'react'
import { useFinanceStore } from '@/store/useFinanceStore'
import { eachDayOfInterval, format, startOfMonth, endOfMonth, subMonths, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SpendingHeatmap() {
  const { transactions } = useFinanceStore()
  const [monthOffset, setMonthOffset] = useState(0)

  const targetMonth = subMonths(new Date(), monthOffset)
  const monthStart = startOfMonth(targetMonth)
  const monthEnd = endOfMonth(targetMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const spendByDay = useMemo(() => {
    const map: Record<string, number> = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const key = t.date
        map[key] = (map[key] ?? 0) + t.amount
      })
    return map
  }, [transactions])

  const maxSpend = Math.max(...days.map((d) => spendByDay[format(d, 'yyyy-MM-dd')] ?? 0), 1)

  const [tooltip, setTooltip] = useState<{ day: string; amount: number; x: number; y: number } | null>(null)

  // Build weeks grid
  const firstDow = monthStart.getDay() // 0=Sun
  const cells: (Date | null)[] = [...Array(firstDow).fill(null), ...days]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Spending Heatmap</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => setMonthOffset((n) => n + 1)} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '0.2rem', cursor: 'pointer' }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 500, fontSize: '0.85rem', minWidth: 100, textAlign: 'center', color: 'var(--text-primary)' }}>
            {format(targetMonth, 'MMM yyyy')}
          </span>
          <button 
            onClick={() => setMonthOffset((n) => Math.max(0, n - 1))} 
            disabled={monthOffset === 0} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '0.2rem', cursor: monthOffset === 0 ? 'not-allowed' : 'pointer', opacity: monthOffset === 0 ? 0.3 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {dayLabels.map((l) => (
          <div key={l} style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{l}</div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div style={{ position: 'relative' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} style={{ aspectRatio: '1', borderRadius: '4px' }} />
              const key = format(day, 'yyyy-MM-dd')
              const spend = spendByDay[key] ?? 0
              const intensity = spend / maxSpend
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={di}
                  title={`${format(day, 'MMM d')}: ₹${spend.toFixed(0)}`}
                  onMouseEnter={(e) => setTooltip({ day: format(day, 'MMM d'), amount: spend, x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: spend > 0
                      ? `rgba(0, 0, 0, ${Math.max(0.08, intensity * 0.9)})` // Monochromatic scale
                      : 'var(--bg-secondary)',
                    border: isToday ? '1px solid var(--text-primary)' : '1px solid transparent',
                    transition: 'transform 0.1s, opacity 0.1s',
                  }}
                  onMouseOver={(e) => { 
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; 
                    (e.currentTarget as HTMLElement).style.zIndex = '10';
                  }}
                  onMouseOut={(e) => { 
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; 
                    (e.currentTarget as HTMLElement).style.zIndex = '1';
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Less</span>
        {[0.05, 0.25, 0.5, 0.75, 0.9].map((op) => (
          <div key={op} style={{ width: 12, height: 12, borderRadius: '2px', background: `rgba(0, 0, 0, ${op})` }} />
        ))}
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>More</span>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 30, zIndex: 200,
          background: 'var(--text-primary)', color: 'var(--bg-primary)', border: '1px solid var(--border-color)',
          borderRadius: '4px', padding: '0.4rem 0.6rem', pointerEvents: 'none',
          fontSize: '0.75rem', fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <span>{tooltip.day}: </span>
          <span style={{ fontWeight: 600 }}>₹{tooltip.amount.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}
