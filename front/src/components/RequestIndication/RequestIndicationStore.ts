import { createStore } from '@yobta/stores'
import { createHookFromStore } from '@yobta/stores/react'

const store = createStore(0)

export const countRequests = (value: number) => {
  const last = store.last()
  store.next(last + value)
}

export const useRequestCount = createHookFromStore(store)
