import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Account } from '../../types'
import { Modal } from '../ui/Modal'
import { Field } from '../ui/Field'
import { Button } from '../ui/Button'
import { inputClass } from '../ui/styles'

const schema = z.object({
  name: z.string().min(1, 'Введите название').max(40, 'Не более 40 символов'),
  currency: z.string().min(1),
  initialBalance: z.coerce.number().min(0, 'Не может быть отрицательным'),
  icon: z.enum(['cash', 'card', 'savings']),
  walletType: z.enum(['physical', 'virtual']),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Account, 'id'>) => void
  initial?: Account | null
}

export function WalletForm({ open, onClose, onSave, initial }: Props) {
  const isEdit = Boolean(initial)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      currency: 'KGS',
      initialBalance: 0,
      icon: 'card',
      walletType: 'physical',
    },
  })

  useEffect(() => {
    if (open) {
      reset(initial
        ? { name: initial.name, currency: initial.currency, initialBalance: initial.initialBalance, icon: initial.icon, walletType: initial.walletType }
        : { name: '', currency: 'KGS', initialBalance: 0, icon: 'card', walletType: 'physical' }
      )
    }
  }, [open, initial, reset])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Редактировать кошелёк' : 'Новый кошелёк'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Название" htmlFor="wf-name" error={errors.name?.message}>
          <input id="wf-name" className={inputClass} placeholder="Моя карта" {...register('name')} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Тип" htmlFor="wf-type" error={errors.walletType?.message}>
            <select id="wf-type" className={inputClass} {...register('walletType')}>
              <option value="physical">Реальный</option>
              <option value="virtual">Виртуальный</option>
            </select>
          </Field>
          <Field label="Иконка" htmlFor="wf-icon" error={errors.icon?.message}>
            <select id="wf-icon" className={inputClass} {...register('icon')}>
              <option value="card">💳 Карта</option>
              <option value="cash">💵 Наличные</option>
              <option value="savings">🐷 Копилка</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Начальный баланс" htmlFor="wf-balance" error={errors.initialBalance?.message}>
            <input id="wf-balance" type="number" min="0" step="0.01" className={inputClass} {...register('initialBalance')} />
          </Field>
          <Field label="Валюта" htmlFor="wf-currency">
            <select id="wf-currency" className={inputClass} {...register('currency')}>
              <option value="KGS">KGS — сом</option>
              <option value="USD">USD — доллар</option>
              <option value="RUB">RUB — рубль</option>
              <option value="EUR">EUR — евро</option>
            </select>
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isEdit ? 'Сохранить' : 'Создать кошелёк'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
        </div>
      </form>
    </Modal>
  )
}
