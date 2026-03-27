export type TransactionType = 'income' | 'expense'
export type DebtType = 'lended' | 'borrowed'
export type Frequency = 'monthly' | 'weekly'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  note: string | null
  date: string
  tax_deductible: boolean
  created_at: string
}

export interface DebtEntry {
  id: string
  type: DebtType
  amount: number
  person: string
  note: string | null
  date: string
  settled: boolean
  created_at: string
}

export interface Subscription {
  id: string
  name: string
  amount: number
  frequency: Frequency
  next_due: string
  category: string
  active: boolean
  created_at: string
}

export interface SavingsEntry {
  id: string
  amount: number
  source_expense_id: string | null
  created_at: string
}

export interface BillSplit {
  id: string
  total_amount: number
  people: string[]
  shares: number[]
  note: string | null
  created_at: string
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Housing',
  'Entertainment',
  'Health',
  'Shopping',
  'Utilities',
  'Education',
  'Travel',
  'Other',
]

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Refund',
  'Other',
]

export const SUBSCRIPTION_CATEGORIES = [
  'Streaming',
  'Music',
  'Gaming',
  'Fitness',
  'Software',
  'News',
  'Other',
]
