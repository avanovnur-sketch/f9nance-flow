import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Sparkles } from 'lucide-react'
import { useDemoData } from '../context/DemoDataContext'
import { useAuth } from '../context/AuthContext'
import type { TxType } from '../types'
import { today } from '../utils/date'
import { balanceSeries, expensesByCategory, inRange, percentChange, summarize, totalBalance } from '../utils/finance'
import { defaultPeriod, previousRange, resolveRange, type PeriodState } from '../utils/period'
import { BalanceCard } from '../components/dashboard/BalanceCard'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { CashFlowChart } from '../components/charts/CashFlowChart'
import { ExpenseCategoryChart } from '../components/charts/ExpenseCategoryChart'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { TransactionFormModal } from '../components/transactions/TransactionForm'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { PeriodPicker } from '../components/ui/PeriodPicker'

export default function DashboardPage() {
  const { transactions, accounts, categories } = useDemoData()
  const { user } = useAuth()
  const [period, setPeriod] = useState<PeriodState>(defaultPeriod('month'))
  const [formType, setFormType] = useState<TxType | null>(null)

  const range = useMemo(() => resolveRange(period), [period])
  const prevRange = useMemo(() => previousRange(range, period.preset), [range, period.preset])

  const data = useMemo(() => {
    const cur = transactions.filter((t) => inRange(t, range))
    const prev = transactions.filter((t) => inRange(t, prevRange))
    const opening = totalBalance(accounts, transactions.filter((t) => t.date < range.from))
    const closing = totalBalance(accounts, transactions.filter((t) => t.date <= range.to))
    return {
      current: summarize(cur),
      previous: summarize(prev),
      balance: totalBalance(accounts, transactions.filter((t) => t.date <= today())),
      change: percentChange(closing, opening),
      series: balanceSeries(accounts, transactions, range),
      byCategory: expensesByCategory(cur, categories),
    }
  }, [transactions, accounts, categories, range, prevRange])

  const monthLabel = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  const recent = transactions.filter((t) => t.date <= today()).slice(0, 6)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер'
  const name = user?.user_metadata?.full_name?.split(' ')[0] ?? null

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold">
            {name ? `${greeting}, ${name} 👋` : 'Обзор финансов'}
          </h1>
          <p className="mt-1 text-sm capitalize text-muted">{monthLabel}</p>
        </div>
        <div className="animate-fade-up delay-100 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <PeriodPicker value={period} onChange={setPeriod} />
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button variant="income" onClick={() => setFormType('income')}>
              <Plus className="size-4" aria-hidden /> Доход
            </Button>
            <Button variant="expense" onClick={() => setFormType('expense')}>
              <Minus className="size-4" aria-hidden /> Расход
            </Button>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        /* Пустой стейт — красивый онбординг */
        <div className="animate-fade-up delay-200 space-y-4">
          {/* Карточка баланса всегда показывается */}
          <section aria-label="Сводка за период" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="md:col-span-2 xl:col-span-1">
              <BalanceCard balance={0} change={null} />
            </div>
            <SummaryCards
              current={{ income: 0, expenses: 0, net: 0 }}
              previous={{ income: 0, expenses: 0, net: 0 }}
              netClassName="md:col-span-2 xl:col-span-1"
            />
          </section>

          <Card className="animate-fade-up delay-300">
            <div className="flex flex-col items-center py-10 text-center">
              <div className="relative mb-5">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg animate-float">
                  <Sparkles className="size-9" />
                </div>
                <div className="animate-pulse-ring absolute inset-0 rounded-2xl bg-violet-400/40" />
              </div>
              <h2 className="text-xl font-bold">Добро пожаловать в FinanceFlow!</h2>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Начните отслеживать свои финансы. Добавьте первую операцию и дашборд оживёт.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button variant="income" onClick={() => setFormType('income')}>
                  <Plus className="size-4" /> Добавить доход
                </Button>
                <Button variant="expense" onClick={() => setFormType('expense')}>
                  <Minus className="size-4" /> Добавить расход
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <>
          <section aria-label="Сводка за период" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="md:col-span-2 xl:col-span-1">
              <BalanceCard balance={data.balance} change={data.change} />
            </div>
            <SummaryCards current={data.current} previous={data.previous} netClassName="md:col-span-2 xl:col-span-1" />
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <Card className="animate-fade-up delay-200 xl:col-span-2">
              <CardHeader title="Изменение баланса" subtitle="Общий баланс на конец каждого дня" />
              <CashFlowChart data={data.series} />
            </Card>
            <Card className="animate-fade-up delay-300">
              <CardHeader title="Расходы по категориям" />
              <ExpenseCategoryChart data={data.byCategory} />
            </Card>
          </section>

          <Card className="animate-fade-up delay-400">
            <CardHeader
              title="Последние операции"
              action={
                <Link to="/transactions" className="inline-flex min-h-11 items-center text-sm font-medium text-accent-text hover:underline">
                  Все операции
                </Link>
              }
            />
            <TransactionTable transactions={recent} categories={categories} accounts={accounts} />
          </Card>
        </>
      )}

      <TransactionFormModal open={formType !== null} onClose={() => setFormType(null)} defaultType={formType ?? 'expense'} />
    </div>
  )
}
