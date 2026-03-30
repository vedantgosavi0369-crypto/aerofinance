'use client'

import { useMemo, useState } from 'react'
import { useFinanceStore } from '@/store/useFinanceStore'
import { eachDayOfInterval, format, startOfMonth, endOfMonth, subMonths, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SpendingHeatmap() {
  const { transactions } = useFinanceStore()
  const [monthOffset, setMonthOffset] = useState(0)

  const targetMonth = subMonths(new Date(), monthOffset)
  const days = eachDayOfInterval({ start: startOfMonth(targetMonth), end: endOfMonth(targetMonth) })

  const spendByDay = useMemo(() => {
    const map: Record<string, number> = {}
    transactions.filter(t => t.type === 'expense').forEach(t => { map[t.date] = (map[t.date] ?? 0) + t.amount })
    return map
  }, [transactions])

  const maxSpend = Math.max(...days.map(d => spendByDay[format(d, 'yyyy-MM-dd')] ?? 0), 1)
  const [tooltip, setTooltip] = useState<{ day: string; amount: number; x: number; y: number } | null>(null)

  const firstDow = startOfMonth(targetMonth).getDay()
  const cells: (Date | null)[] = [...Array(firstDow).fill(null), ...days]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>Spending Heatmap</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => setMonthOffset(n => n + 1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.3rem', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(6px)' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 500, fontSize: '0.85rem', minWidth: 100, textAlign: 'center', color: 'rgba(255,255,255,0.75)' }}>{format(targetMonth, 'MMM yyyy')}</span>
          <button onClick={() => setMonthOffset(n => Math.max(0, n - 1))} disabled={monthOffset === 0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.3rem', cursor: monthOffset === 0 ? 'not-allowed' : 'pointer', color: 'rgba(255,255,255,0.6)', opacity: monthOffset === 0 ? 0.35 : 1, backdropFilter: 'blur(6px)' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(l => (
          <div key={l} style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{l}</div>
        ))}
      </div>

      <div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} style={{ aspectRatio: '1' }} />
              const key = format(day, 'yyyy-MM-dd')
              const spend = spendByDay[key] ?? 0
              const intensity = spend / maxSpend
              const isToday = isSameDay(day, new Date())
              return (
                <div
                  key={di}
                  onMouseEnter={e => setTooltip({ day: format(day, 'MMM d'), amount: spend, x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    aspectRatio: '1', borderRadius: '6px', cursor: 'pointer',
                    background: spend > 0
                      ? `rgba(91, 155, 255, ${Math.max(0.1, intensity * 0.9)})`
                      : 'rgba(255,255,255,0.04)',
                    border: isToday ? '1px solid rgba(91,155,255,0.6)' : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: spend > 0 ? `0 0 ${8 * intensity}px rgba(91,155,255,${intensity * 0.5})` : 'none',
                    transition: 'all 0.15s ease',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'; (e.currentTarget as HTMLElement).style.zIndex = '10' }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.zIndex = '1' }}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Less</span>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map(op => (
          <div key={op} style={{ width: 12, height: 12, borderRadius: '4px', background: `rgba(91,155,255,${op})`, boxShadow: `0 0 4px rgba(91,155,255,${op * 0.6})` }} />
        ))}
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>More</span>
      </div>

      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 35, zIndex: 300, background: 'rgba(10,8,25,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.4rem 0.75rem', pointerEvents: 'none', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          {tooltip.day}: ₹{tooltip.amount.toFixed(2)}
        </div>
      )}
    </div>
  )
}
