import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import {
  Transaction,
  DebtEntry,
  Subscription,
  SavingsEntry,
} from '@/types'
import { isAfter, parseISO, addMonths, addWeeks, format } from 'date-fns'

interface FinanceStore {
  transactions: Transaction[]
  debts: DebtEntry[]
  subscriptions: Subscription[]
  savingsVault: SavingsEntry[]
  privacyMode: boolean
  loading: boolean

  // Loaders
  loadAll: () => Promise<void>

  // Transactions
  addTransaction: (t: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  // Debts
  addDebt: (d: Omit<DebtEntry, 'id' | 'created_at'>) => Promise<void>
  settleDebt: (id: string) => Promise<void>
  deleteDebt: (id: string) => Promise<void>

  // Subscriptions
  addSubscription: (s: Omit<Subscription, 'id' | 'created_at'>) => Promise<void>
  toggleSubscription: (id: string, active: boolean) => Promise<void>
  deleteSubscription: (id: string) => Promise<void>
  processSubscriptions: () => Promise<void>

  // Savings
  withdrawSavings: () => Promise<void>

  // Privacy
  togglePrivacyMode: () => void

  // Computed
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getTotalBorrowed: () => number
  getTotalLended: () => number
  getTotalBalance: () => number
  getAvgDailySpend: () => number
  getTotalSavings: () => number
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  debts: [],
  subscriptions: [],
  savingsVault: [],
  privacyMode: false,
  loading: false,

  loadAll: async () => {
    set({ loading: true })
    const [txRes, dbtRes, subRes, savRes] = await Promise.all([
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('debts').select('*').order('date', { ascending: false }),
      supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
      supabase.from('savings_vault').select('*').order('created_at', { ascending: false }),
    ])
    set({
      transactions: txRes.data ?? [],
      debts: dbtRes.data ?? [],
      subscriptions: subRes.data ?? [],
      savingsVault: savRes.data ?? [],
      loading: false,
    })
    await get().processSubscriptions()
  },

  addTransaction: async (t) => {
    // Round-up: if expense, calculate roundup
    let roundup = 0
    if (t.type === 'expense') {
      const ceil = Math.ceil(t.amount)
      roundup = parseFloat((ceil - t.amount).toFixed(2))
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([t])
      .select()
      .single()
    if (error || !data) return

    const newTx: Transaction = data
    set((s) => ({ transactions: [newTx, ...s.transactions] }))

    if (roundup > 0 && t.type === 'expense') {
      const { data: saveData } = await supabase
        .from('savings_vault')
        .insert([{ amount: roundup, source_expense_id: newTx.id }])
        .select()
        .single()
      if (saveData) {
        set((s) => ({ savingsVault: [saveData, ...s.savingsVault] }))
      }
    }
  },

  deleteTransaction: async (id) => {
    await supabase.from('savings_vault').delete().eq('source_expense_id', id)
    await supabase.from('transactions').delete().eq('id', id)
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
      savingsVault: s.savingsVault.filter((sv) => sv.source_expense_id !== id),
    }))
  },

  addDebt: async (d) => {
    const { data } = await supabase.from('debts').insert([d]).select().single()
    if (data) set((s) => ({ debts: [data, ...s.debts] }))
  },

  settleDebt: async (id) => {
    await supabase.from('debts').update({ settled: true }).eq('id', id)
    set((s) => ({
      debts: s.debts.map((d) => (d.id === id ? { ...d, settled: true } : d)),
    }))
  },

  deleteDebt: async (id) => {
    await supabase.from('debts').delete().eq('id', id)
    set((s) => ({ debts: s.debts.filter((d) => d.id !== id) }))
  },

  addSubscription: async (s) => {
    const { data } = await supabase.from('subscriptions').insert([s]).select().single()
    if (data) set((st) => ({ subscriptions: [data, ...st.subscriptions] }))
  },

  toggleSubscription: async (id, active) => {
    await supabase.from('subscriptions').update({ active }).eq('id', id)
    set((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, active } : sub
      ),
    }))
  },

  deleteSubscription: async (id) => {
    await supabase.from('subscriptions').delete().eq('id', id)
    set((s) => ({ subscriptions: s.subscriptions.filter((sub) => sub.id !== id) }))
  },

  processSubscriptions: async () => {
    const { subscriptions } = get()
    const today = new Date()
    const toProcess = subscriptions.filter(
      (s) => s.active && isAfter(today, parseISO(s.next_due))
    )
    for (const sub of toProcess) {
      // Insert expense transaction
      const { data: txData } = await supabase
        .from('transactions')
        .insert([{
          type: 'expense',
          amount: sub.amount,
          category: sub.category,
          note: `Subscription: ${sub.name}`,
          date: format(today, 'yyyy-MM-dd'),
          tax_deductible: false,
        }])
        .select()
        .single()

      // Update next_due
      const newDue = sub.frequency === 'monthly'
        ? addMonths(parseISO(sub.next_due), 1)
        : addWeeks(parseISO(sub.next_due), 1)
      const nextDueStr = format(newDue, 'yyyy-MM-dd')
      await supabase
        .from('subscriptions')
        .update({ next_due: nextDueStr })
        .eq('id', sub.id)

      if (txData) {
        set((s) => ({
          transactions: [txData, ...s.transactions],
          subscriptions: s.subscriptions.map((su) =>
            su.id === sub.id ? { ...su, next_due: nextDueStr } : su
          ),
        }))
      }
    }
  },

  withdrawSavings: async () => {
    const total = get().getTotalSavings()
    if (total <= 0) return
    await supabase.from('savings_vault').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    const { data: txData } = await supabase
      .from('transactions')
      .insert([{
        type: 'income',
        amount: total,
        category: 'Other',
        note: 'Savings vault withdrawal',
        date: format(new Date(), 'yyyy-MM-dd'),
        tax_deductible: false,
      }])
      .select()
      .single()
    if (txData) {
      set((s) => ({
        savingsVault: [],
        transactions: [txData, ...s.transactions],
      }))
    }
  },

  togglePrivacyMode: () => set((s) => ({ privacyMode: !s.privacyMode })),

  getTotalIncome: () =>
    get().transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0),

  getTotalExpenses: () =>
    get().transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0),

  getTotalBorrowed: () =>
    get().debts
      .filter((d) => d.type === 'borrowed' && !d.settled)
      .reduce((acc, d) => acc + d.amount, 0),

  getTotalLended: () =>
    get().debts
      .filter((d) => d.type === 'lended' && !d.settled)
      .reduce((acc, d) => acc + d.amount, 0),

  getTotalBalance: () => {
    const { getTotalIncome, getTotalExpenses, getTotalBorrowed, getTotalLended } = get()
    return (getTotalIncome() + getTotalBorrowed()) - (getTotalExpenses() + getTotalLended())
  },

  getAvgDailySpend: () => {
    const expenses = get().transactions.filter((t) => t.type === 'expense')
    if (expenses.length === 0) return 0
    const dates = expenses.map((e) => e.date)
    const earliest = dates.reduce((a, b) => (a < b ? a : b))
    const daysDiff = Math.max(
      1,
      Math.ceil(
        (new Date().getTime() - parseISO(earliest).getTime()) / (1000 * 60 * 60 * 24)
      )
    )
    return get().getTotalExpenses() / daysDiff
  },

  getTotalSavings: () =>
    get().savingsVault.reduce((acc, s) => acc + s.amount, 0),
}))
