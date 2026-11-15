import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { formatMoney, formatPercent } from '../../utils/format'

interface Props {
  balance: number
  change: number | null
}

export function BalanceCard({ balance, change }: Props) {
  const up = (change ?? 0) >= 0
  return (
    <div className="animate-fade-up relative overflow-hidden rounded-2xl p-6 text-white"
      style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #0ea5e9 100%)' }}>
      {/* Декоративные круги */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 size-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute right-12 top-16 size-16 rounded-full bg-white/10" />

      <div className="relative">
        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
          <Wallet className="size-4" aria-hidden />
          Общий баланс
        </div>
        <p className="tabular mt-3 text-4xl font-bold tracking-tight sm:text-5xl animate-fade-up delay-100">
          {formatMoney(balance)}
        </p>
        <div className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium
          ${up ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-400/20 text-rose-200'}`}>
          {change === null ? (
            <span className="text-white/60 text-xs">Нет данных для сравнения</span>
          ) : (
            <>
              {up
                ? <TrendingUp className="size-4" aria-hidden />
                : <TrendingDown className="size-4" aria-hidden />}
              {formatPercent(change)} за период
            </>
          )}
        </div>
      </div>
    </div>
  )
}
