import { Banknote, CreditCard, PiggyBank, Sparkles, type LucideIcon } from 'lucide-react'
import type { Account } from '../../types'
import { formatMoney } from '../../utils/format'

const ICONS: Record<string, LucideIcon> = {
  cash: Banknote,
  card: CreditCard,
  savings: PiggyBank,
}

const PHYSICAL_GRADIENTS = [
  'from-violet-600 via-indigo-600 to-blue-600',
  'from-blue-600 via-cyan-600 to-teal-500',
  'from-rose-600 via-pink-600 to-fuchsia-600',
]

const VIRTUAL_GRADIENTS = [
  'from-amber-500 via-orange-500 to-rose-500',
  'from-teal-500 via-emerald-500 to-green-500',
  'from-fuchsia-600 via-purple-600 to-indigo-600',
]

interface Props {
  account: Account
  balance: number
  index: number
}

export function WalletCard({ account, balance, index }: Props) {
  const Icon = ICONS[account.icon] ?? Banknote
  const isVirtual = account.walletType === 'virtual'
  const gradients = isVirtual ? VIRTUAL_GRADIENTS : PHYSICAL_GRADIENTS
  const gradient = gradients[index % gradients.length]

  return (
    <div
      className={`animate-fade-up relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-xl`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Декоративные элементы */}
      <div className="pointer-events-none absolute -right-6 -top-6 size-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 right-8 size-24 rounded-full bg-white/10" />

      {/* Шип карточки для реального кошелька */}
      {!isVirtual && (
        <div className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-white/30" />
      )}

      {/* Верхняя строка */}
      <div className="flex items-start justify-between">
        <div className={`flex size-11 items-center justify-center rounded-xl ${isVirtual ? 'bg-white/20' : 'bg-white/15'} backdrop-blur-sm`}>
          <Icon className="size-5" aria-hidden />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          {isVirtual
            ? <><Sparkles className="size-3" /> Виртуальный</>
            : <><div className="size-1.5 rounded-full bg-green-300 animate-pulse" /> Реальный</>
          }
        </div>
      </div>

      {/* Баланс */}
      <div className="mt-6">
        <p className="text-xs font-medium text-white/70">Баланс</p>
        <p className="tabular mt-1 text-3xl font-bold tracking-tight">{formatMoney(balance)}</p>
      </div>

      {/* Нижняя строка */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-xs text-white/70">Название</p>
          <p className="text-sm font-semibold">{account.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/70">Валюта</p>
          <p className="text-sm font-semibold">{account.currency}</p>
        </div>
      </div>

      {/* Декоративные чипы для карты */}
      {account.icon === 'card' && (
        <div className="pointer-events-none absolute bottom-6 left-6 flex gap-1 opacity-20">
          <div className="h-5 w-7 rounded bg-white/60" />
        </div>
      )}
    </div>
  )
}
