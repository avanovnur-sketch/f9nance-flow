// ДЕМО-ДАННЫЕ. Генерируются в браузере, не связаны ни с каким реальным аккаунтом.
// В готовой версии заменяются ответами API (см. client/src/services).
import type { Account, Budget, Category, Transaction } from '../types'

export const demoCategories: Category[] = [
  { id: 'food', name: 'Еда', type: 'expense', color: '#f59e0b' },
  { id: 'transport', name: 'Транспорт', type: 'expense', color: '#3b82f6' },
  { id: 'housing', name: 'Жильё', type: 'expense', color: '#8b5cf6' },
  { id: 'comm', name: 'Связь и интернет', type: 'expense', color: '#06b6d4' },
  { id: 'shop', name: 'Покупки', type: 'expense', color: '#ec4899' },
  { id: 'fun', name: 'Развлечения', type: 'expense', color: '#f43f5e' },
  { id: 'health', name: 'Здоровье', type: 'expense', color: '#14b8a6' },
  { id: 'salary', name: 'Зарплата', type: 'income', color: '#10b981' },
  { id: 'freelance', name: 'Фриланс', type: 'income', color: '#22c55e' },
  { id: 'bonus', name: 'Бонус', type: 'income', color: '#84cc16' },
]

export const demoAccounts: Account[] = [
  { id: 'cash', name: 'Наличные', currency: 'KGS', initialBalance: 0, icon: 'cash', walletType: 'physical' },
  { id: 'card', name: 'Банковская карта', currency: 'KGS', initialBalance: 0, icon: 'card', walletType: 'physical' },
  { id: 'savings', name: 'Виртуальный кошелёк', currency: 'KGS', initialBalance: 0, icon: 'savings', walletType: 'virtual' },
]

export const demoBudgets: Budget[] = [
  { id: 'b-total', categoryId: null, limit: 40000 },
  { id: 'b-food', categoryId: 'food', limit: 12000 },
  { id: 'b-transport', categoryId: 'transport', limit: 3000 },
  { id: 'b-shop', categoryId: 'shop', limit: 6000 },
  { id: 'b-fun', categoryId: 'fun', limit: 4000 },
]

export function buildDemoTransactions(): Transaction[] {
  return []
}
