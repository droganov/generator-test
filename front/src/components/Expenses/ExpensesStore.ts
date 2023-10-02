import { createDerivedStore, createStore } from '@yobta/stores'

import { Expense } from '../../../generated/api'
import { createHookFromStore } from '@yobta/stores/react'

const store = createStore<Expense[]>([])

export const addExpenses = (expenses: Expense[]) => {
  const last = store.last()
  store.next([...last, ...expenses])
}

const expenseCategories = createDerivedStore((expenses) => {
  const categories: Record<string, [number, string, string]> = {}
  for (const expense of expenses) {
    if (categories[expense.category.slug]) {
      categories[expense.category.slug][0] += expense.amount
    } else {
      categories[expense.category.slug] = [
        expense.amount,
        expense.currencyCode,
        expense.category.name,
      ]
    }
  }
  return Object.entries(categories).map(
    ([categorySlug, [amount, currency, categoryName]]) => ({
      categoryName,
      categorySlug,
      amount,
      currency,
    })
  )
}, store)

export const useExpences = createHookFromStore(store)

export const useExpenseCategories = createHookFromStore(expenseCategories)
