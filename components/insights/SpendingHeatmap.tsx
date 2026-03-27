'use client'

import { useMemo, useState } from 'react'
import { useFinanceStore } from '@/store/useFinanceStore'
import { eachDayOfInterval, format, startOfMonth, endOfMonth, subMonths, isSameDay } from 'date-fns'

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

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Spending Heatmap</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => setMonthOffset((n) => n + 1)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8f0', borderRadius: '0.5rem', padding: '0.3rem 0.75rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem' }}>‹</button>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', minWidth: 110, textAlign: 'center' }}>{format(targetMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setMonthOffset((n) => Math.max(0, n - 1))} disabled={monthOffset === 0} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: monthOffset === 0 ? 'rgba(232,232,240,0.2)' : '#e8e8f0', borderRadius: '0.5rem', padding: '0.3rem 0.75rem', cursor: monthOffset === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem' }}>›</button>
        </div>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {dayLabels.map((l) => (
          <div key={l} style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(232,232,240,0.35)', paddingBottom: 2 }}>{l}</div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div style={{ position: 'relative' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} style={{ aspectRatio: '1', borderRadius: 6 }} />
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
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: spend > 0
                      ? `rgba(255, 107, 151, ${Math.max(0.12, intensity * 0.85)})`
                      : 'rgba(255,255,255,0.04)',
                    border: isToday ? '1px solid rgba(124,106,255,0.7)' : '1px solid transparent',
                    transition: 'transform 0.1s',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)' }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(232,232,240,0.35)' }}>Low</span>
        {[0.1, 0.25, 0.45, 0.65, 0.85].map((op) => (
          <div key={op} style={{ width: 14, height: 14, borderRadius: 3, background: `rgba(255,107,151,${op})` }} />
        ))}
        <span style={{ fontSize: '0.7rem', color: 'rgba(232,232,240,0.35)' }}>High</span>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 40, zIndex: 200,
          background: 'rgba(13,13,31,0.95)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.6rem', padding: '0.4rem 0.75rem', pointerEvents: 'none',
          fontSize: '0.78rem', fontWeight: 500,
        }}>
          <span style={{ color: 'rgba(232,232,240,0.6)' }}>{tooltip.day} </span>
          <span style={{ color: '#ff6b97' }}>₹{tooltip.amount.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}
