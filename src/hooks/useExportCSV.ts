import type { Account, Category, Transaction } from '../types'

function escapeCSV(val: string | number): string {
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

const TYPE_LABELS: Record<string, string> = {
  income: 'Доход',
  expense: 'Расход',
  transfer: 'Перевод',
}

export function useExportCSV() {
  return function exportCSV(
    transactions: Transaction[],
    categories: Category[],
    accounts: Account[],
  ) {
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))
    const accMap = Object.fromEntries(accounts.map((a) => [a.id, a.name]))

    const header = ['Дата', 'Тип', 'Сумма', 'Описание', 'Категория', 'Счёт', 'Счёт назначения']
    const rows = transactions.map((t) => [
      t.date,
      TYPE_LABELS[t.type] ?? t.type,
      t.type === 'expense' ? -t.amount : t.amount,
      t.description,
      t.categoryId ? (catMap[t.categoryId] ?? t.categoryId) : '',
      accMap[t.accountId] ?? t.accountId,
      t.toAccountId ? (accMap[t.toAccountId] ?? t.toAccountId) : '',
    ])

    const csv = [header, ...rows].map((r) => r.map(escapeCSV).join(',')).join('\n')
    const bom = '\uFEFF' // UTF-8 BOM для Excel
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financeflow-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
}
