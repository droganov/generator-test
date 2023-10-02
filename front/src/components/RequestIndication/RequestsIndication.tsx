'use client'

import { LinearProgress } from '@yobta/ui'
import { FunctionComponent } from 'react'
import { useRequestCount } from './RequestIndicationStore'

export const RequestsIndication: FunctionComponent = () => {
  const count = useRequestCount()
  return (
    count > 0 && (
      <LinearProgress className="fixed top-0 left-0 right-0 w-full h-[2px] z-yobta-toast--top" />
    )
  )
}
