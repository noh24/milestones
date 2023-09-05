'use client'

import {
  QueryClientProvider as Provider,
  QueryClient,
} from '@tanstack/react-query'
import { ReactNode } from 'react'

type TProps = {
  children: ReactNode
}

const queryClient = new QueryClient()

export default function QueryClientProvider({ children }: TProps) {
  return <Provider client={queryClient}>{children}</Provider>
}
