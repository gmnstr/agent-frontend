import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '../theme/ThemeProvider'
import { router } from './router'

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}

export const App = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
