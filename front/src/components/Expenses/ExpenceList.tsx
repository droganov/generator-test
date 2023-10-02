import { FunctionComponent } from 'react'
import { format } from 'date-fns'

import { useExpences } from './ExpensesStore'

const formatCurrency = (amount: number, currencyCode: string) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  })
  return formatter.format(amount)
}

export const ExpenceList: FunctionComponent = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 yobta-list">
      {useExpences().map(
        ({ amount, currencyCode, title, category, time }, index) => (
          <div className=" yobta-list-item">
            <div>
              {title} — {formatCurrency(amount, currencyCode)} <br />
              <small>
                {category.name} {format(new Date(time), 'dd MMM yyyy, HH:mm')}
              </small>
            </div>
          </div>
        )
      )}
    </div>
  )
}
