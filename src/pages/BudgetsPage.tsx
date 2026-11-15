import { AlertTriangle, CheckCircle2, Target } from 'lucide-react'
import { useBudgetUsage } from '../hooks/useBudgetUsage'
import { BudgetProgress } from '../components/budgets/BudgetProgress'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export default function BudgetsPage() {
  const usage = useBudgetUsage()
  const monthLabel = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  const total = usage.find((u) => u.id === 'b-total')
  const categoryBudgets = usage.filter((u) => u.id !== 'b-total')
  const warnings = usage.filter((u) => u.status !== 'ok')
  const exceeded = warnings.filter((u) => u.status === 'exceeded')
  const nearLimit = warnings.filter((u) => u.status === 'warning')

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold">Бюджеты</h1>
        <p className="mt-1 text-sm capitalize text-muted">{monthLabel}</p>
      </div>

      {/* Уведомления о превышении */}
      {exceeded.length > 0 && (
        <div className="animate-fade-up delay-100 rounded-2xl border border-expense/40 bg-rose-50 p-4 dark:bg-rose-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-expense" />
            <div>
              <p className="font-semibold text-expense">Превышен лимит: {exceeded.length} категор{exceeded.length === 1 ? 'ия' : 'ии'}</p>
              <ul className="mt-1 space-y-0.5 text-sm text-muted">
                {exceeded.map((w) => (
                  <li key={w.id}>• {w.name}: лимит превышен</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {nearLimit.length > 0 && (
        <div className="animate-fade-up delay-150 rounded-2xl border border-warn/40 bg-amber-50 p-4 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" />
            <div>
              <p className="font-semibold text-warn">Близко к лимиту: {nearLimit.length} категор{nearLimit.length === 1 ? 'ия' : 'ии'}</p>
              <ul className="mt-1 space-y-0.5 text-sm text-muted">
                {nearLimit.map((w) => (
                  <li key={w.id}>• {w.name}: использовано 80% и более</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {warnings.length === 0 && usage.length > 0 && (
        <div className="animate-fade-up delay-100 flex items-center gap-3 rounded-2xl border border-income/30 bg-emerald-50 px-4 py-3 dark:bg-emerald-950/20">
          <CheckCircle2 className="size-5 shrink-0 text-income" />
          <p className="text-sm font-medium text-income">Все бюджеты в норме</p>
        </div>
      )}

      {usage.length === 0 ? (
        <Card className="animate-fade-up delay-200">
          <EmptyState
            title="Бюджетов пока нет"
            description="После добавления транзакций бюджеты по категориям появятся здесь"
          />
        </Card>
      ) : (
        <>
          {total && (
            <div className="animate-fade-up delay-100">
              <BudgetProgress {...total} />
            </div>
          )}
          <section aria-label="Лимиты по категориям" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categoryBudgets.map((b, i) => (
              <div key={b.id} className="animate-fade-up" style={{ animationDelay: `${(i + 2) * 0.07}s` }}>
                <BudgetProgress {...b} />
              </div>
            ))}
          </section>
        </>
      )}

      <div className="animate-fade-up flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-muted">
        <Target className="size-4 shrink-0" />
        Учитываются только расходы текущего месяца. Переводы между счетами в бюджет не входят.
      </div>
    </div>
  )
}
