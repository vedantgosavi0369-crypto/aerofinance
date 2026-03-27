'use client'

import { useEffect } from 'react'
import { useFinanceStore } from '@/store/useFinanceStore'

export default function DataLoader() {
  const loadAll = useFinanceStore((s) => s.loadAll)
  useEffect(() => { loadAll() }, [loadAll])
  return null
}
