import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown, TrendingUp, Wallet, type LucideIcon } from 'lucide-react'
import type { Summary } from '../../utils/finance'
import { percentChange } from '../../utils/finance'
import { formatMoney, formatPercent, formatSignedMoney } from '../../utils/format'

function Delta({ current, previous, goodWhenUp }: { current: number; previous: number; goodWhenUp: boolean }) {
  const pct = percentChange(current, previous)
  if (pct === null) return <p className="mt-2 text-xs text-muted">Нет данных за прошлый период</p>
  if (pct === 0) {
    return (
      <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
        <Minus className="size-3.5" aria-hidden />0% к прошлому периоду
      </p>
    )
  }
  const up = pct > 0
  const good = up === goodWhenUp
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <p className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${good ? 'text-income' : 'text-expense'}`}>
      <Icon className="size-3.5" aria-hidden />
      {formatPercent(pct)} к прошлому периоду
    </p>
  )
}

function Item({
  label,
  icon: Icon,
  value,
  valueClass,
  accentClass,
  children,
  className,
  delay,
}: {
  label: string
  icon: LucideIcon
  value: string
  valueClass: string
  accentClass: string
  children: ReactNode
  className?: string
  delay?: string
}) {
  return (
    <div className={`animate-fade-up rounded-2xl border border-border bg-card p-5 transition hover:shadow-md hover:-translate-y-0.5 ${delay ?? ''} ${className ?? ''}`}>
      <div className={`inline-flex size-10 items-center justify-center rounded-xl ${accentClass}`}>
        <Icon className="size-5" aria-hidden />
      </div>
      <p className="mt-3 text-sm text-muted">{label}</p>
      <p className={`tabular mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
      {children}
    </div>
  )
}

interface Props {
  current: Summary
  previous: Summary
  netClassName?: string
}

export function SummaryCards({ current, previous, netClassName }: Props) {
  return (
    <>
      <Item
        label="Доходы"
        icon={TrendingUp}
        value={`+${formatMoney(current.income)}`}
        valueClass="text-income"
        accentClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        delay="delay-100"
      >
        <Delta current={current.income} previous={previous.income} goodWhenUp />
      </Item>
      <Item
        label="Расходы"
        icon={TrendingDown}
        value={`−${formatMoney(current.expenses)}`}
        valueClass="text-expense"
        accentClass="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        delay="delay-200"
      >
        <Delta current={current.expenses} previous={previous.expenses} goodWhenUp={false} />
      </Item>
      <Item
        label="Денежный поток"
        icon={Wallet}
        value={formatSignedMoney(current.net)}
        valueClass={current.net >= 0 ? 'text-income' : 'text-expense'}
        accentClass="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
        className={netClassName}
        delay="delay-300"
      >
        <Delta current={current.net} previous={previous.net} goodWhenUp />
      </Item>
    </>
  )
}
