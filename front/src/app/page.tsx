import type { Metadata } from 'next'
import type { FunctionComponent } from 'react'

import { Audio } from './Audio'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'App Yobta',
}

const HomePage: FunctionComponent = () => {
  return <Audio />
}

export default HomePage
