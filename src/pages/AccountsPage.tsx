import { useMemo, useState } from 'react'
import { Edit2, Plus, Sparkles, Trash2, Wallet } from 'lucide-react'
import { useDemoData } from '../context/DemoDataContext'
import { useToast } from '../context/ToastContext'
import { accountBalance, totalBalance } from '../utils/finance'
import { formatMoney } from '../utils/format'
import type { Account } from '../types'
import { WalletCard } from '../components/accounts/WalletCard'
import { WalletForm } from '../components/accounts/WalletForm'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'

export default function AccountsPage() {
  const { accounts, transactions, categories, addAccount, updateAccount, deleteAccount } = useDemoData()
  const { toast } = useToast()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Account | null>(null)
  const [deleting, setDeleting] = useState<Account | null>(null)

  const total = useMemo(() => totalBalance(accounts, transactions), [accounts, transactions])
  const transfers = useMemo(() => transactions.filter((t) => t.type === 'transfer').slice(0, 5), [transactions])

  const physical = accounts.filter((a) => a.walletType === 'physical')
  const virtual = accounts.filter((a) => a.walletType === 'virtual')

  const physicalTotal = useMemo(
    () => physical.reduce((sum, a) => sum + accountBalance(a, transactions), 0),
    [physical, transactions],
  )
  const virtualTotal = useMemo(
    () => virtual.reduce((sum, a) => sum + accountBalance(a, transactions), 0),
    [virtual, transactions],
  )

  const openEdit = (a: Account) => { setEditing(a); setFormOpen(true) }
  const openCreate = () => { setEditing(null); setFormOpen(true) }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Счета и кошельки</h1>
          <p className="mt-1 text-sm text-muted">Управляйте своими реальными и виртуальными кошельками</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-border bg-card px-5 py-3 text-right">
            <p className="text-xs text-muted">Общий баланс</p>
            <p className="tabular text-2xl font-bold">{formatMoney(total)}</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Кошелёк
          </Button>
        </div>
      </div>

      {/* Реальные кошельки */}
      {physical.length > 0 && (
        <section>
          <div className="animate-fade-up delay-100 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Wallet className="size-4" />
              </div>
              <div>
                <h2 className="font-semibold">Реальные кошельки</h2>
                <p className="text-xs text-muted">Итого: <span className="tabular font-semibold text-fg">{formatMoney(physicalTotal)}</span></p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {physical.map((a, i) => (
              <div key={a.id} className="group relative">
                <WalletCard account={a} balance={accountBalance(a, transactions)} index={i} />
                {/* Кнопки управления */}
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(a)}
                    className="flex size-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    aria-label={`Редактировать ${a.name}`}
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleting(a)}
                    className="flex size-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm hover:bg-rose-500/60"
                    aria-label={`Удалить ${a.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={openCreate}
              className="animate-fade-up flex min-h-[180px] items-center justify-center rounded-2xl border-2 border-dashed border-border text-muted transition hover:border-accent hover:text-accent-text"
            >
              <div className="flex flex-col items-center gap-2">
                <Plus className="size-6" />
                <span className="text-sm font-medium">Добавить кошелёк</span>
              </div>
            </button>
          </div>
        </section>
      )}

      {/* Виртуальные кошельки */}
      {virtual.length > 0 && (
        <section>
          <div className="animate-fade-up delay-200 mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="font-semibold">Виртуальные кошельки</h2>
              <p className="text-xs text-muted">Итого: <span className="tabular font-semibold text-fg">{formatMoney(virtualTotal)}</span></p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {virtual.map((a, i) => (
              <div key={a.id} className="group relative">
                <WalletCard account={a} balance={accountBalance(a, transactions)} index={i} />
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(a)}
                    className="flex size-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    aria-label={`Редактировать ${a.name}`}
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleting(a)}
                    className="flex size-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm hover:bg-rose-500/60"
                    aria-label={`Удалить ${a.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Пустой стейт */}
      {accounts.length === 0 && (
        <Card className="animate-fade-up">
          <EmptyState
            title="Нет кошельков"
            description="Добавьте первый кошелёк, чтобы начать отслеживать финансы"
            action={<Button onClick={openCreate}><Plus className="size-4" /> Добавить кошелёк</Button>}
          />
        </Card>
      )}

      {/* Переводы */}
      <Card className="animate-fade-up delay-300">
        <CardHeader
          title="Последние переводы"
          subtitle="Переводы между счетами не попадают в доходы и расходы"
        />
        {transfers.length === 0 ? (
          <EmptyState title="Переводов пока нет" description="После первого перевода между счётами он появится здесь" />
        ) : (
          <TransactionTable transactions={transfers} categories={categories} accounts={accounts} />
        )}
      </Card>

      {/* Форма кошелька */}
      <WalletForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSave={(data) => {
          if (editing) {
            updateAccount(editing.id, data)
            toast('Кошелёк обновлён')
          } else {
            addAccount(data)
            toast('Кошелёк создан')
          }
        }}
      />

      {/* Подтверждение удаления */}
      <ConfirmDialog
        open={deleting !== null}
        title="Удалить кошелёк?"
        message={deleting ? `Кошелёк «${deleting.name}» и все связанные операции будут удалены. Это нельзя отменить.` : ''}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            deleteAccount(deleting.id)
            toast('Кошелёк удалён')
          }
          setDeleting(null)
        }}
      />
    </div>
  )
}
