import { FunctionComponent } from 'react'
import { useExpenseCategories } from './ExpensesStore'
import clsx from 'clsx'

const bgs = [
  'yobta-bg-1',
  'yobta-bg-2',
  'yobta-bg-3',
  'yobta-bg-4',
  'yobta-bg-5',
  'yobta-bg-6',
  'yobta-bg-7',
  'yobta-bg-8',
  'yobta-bg-9',
  'yobta-bg-10',
  'yobta-bg-11',
  'yobta-bg-12',
  'yobta-bg-13',
  'yobta-bg-14',
  'yobta-bg-15',
]

export const ExpenceCategories: FunctionComponent = () => {
  const categories = useExpenseCategories()
  return (
    <div className="flex items-center justify-center gap-2">
      {categories.map(({ amount, currency, categoryName }, index) => (
        <div className={clsx('yobta-badge', bgs[bgs.length % index])}>
          {categoryName} ({amount} {currency})
        </div>
      ))}
    </div>
  )
}
