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

  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  return (
    <div className="glass-card" style={{ padding: '1.5rem', background: '#000', border: '3px solid #FFF', boxShadow: '4px 4px 0px #FF4081' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', color: '#FFF' }}>Spending Heatmap</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => setMonthOffset((n) => n + 1)} style={{ background: '#000', border: '2px solid #FFF', color: '#FFF', borderRadius: '0', padding: '0.3rem 0.75rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 900, boxShadow: '2px 2px 0px #FFF' }}>‹</button>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: 120, textAlign: 'center', textTransform: 'uppercase', color: '#FF4081' }}>{format(targetMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setMonthOffset((n) => Math.max(0, n - 1))} disabled={monthOffset === 0} style={{ background: '#000', border: '2px solid #FFF', color: monthOffset === 0 ? '#555' : '#FFF', borderRadius: '0', padding: '0.3rem 0.75rem', cursor: monthOffset === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 900, boxShadow: monthOffset === 0 ? 'none' : '2px 2px 0px #FFF', opacity: monthOffset === 0 ? 0.5 : 1 }}>›</button>
        </div>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
        {dayLabels.map((l) => (
          <div key={l} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#FFF', paddingBottom: 2, fontWeight: 800 }}>{l}</div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div style={{ position: 'relative' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} style={{ aspectRatio: '1', borderRadius: 0 }} />
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
                    borderRadius: 0,
                    cursor: 'pointer',
                    background: spend > 0
                      ? `rgba(255, 64, 129, ${Math.max(0.15, intensity * 0.95)})` // matches #FF4081
                      : '#000',
                    border: isToday ? '3px solid #00E676' : '2px solid #333',
                    transition: 'transform 0.1s, border-color 0.1s',
                  }}
                  onMouseOver={(e) => { 
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'; 
                    (e.currentTarget as HTMLElement).style.borderColor = '#FFF';
                    (e.currentTarget as HTMLElement).style.zIndex = '10';
                  }}
                  onMouseOut={(e) => { 
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; 
                    (e.currentTarget as HTMLElement).style.borderColor = isToday ? '#00E676' : '#333';
                    (e.currentTarget as HTMLElement).style.zIndex = '1';
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: 800, textTransform: 'uppercase' }}>Low</span>
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((op) => (
          <div key={op} style={{ width: 14, height: 14, borderRadius: 0, background: `rgba(255, 64, 129, ${op})`, border: '1px solid #333' }} />
        ))}
        <span style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: 800, textTransform: 'uppercase' }}>High</span>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 40, zIndex: 200,
          background: '#FFF', border: '3px solid #000',
          borderRadius: '0', padding: '0.4rem 0.75rem', pointerEvents: 'none',
          fontSize: '0.85rem', fontWeight: 900, boxShadow: '4px 4px 0px #000'
        }}>
          <span style={{ color: '#000', textTransform: 'uppercase' }}>{tooltip.day} </span>
          <span style={{ color: '#FF4081' }}>₹{tooltip.amount.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}
