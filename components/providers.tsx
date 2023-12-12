"use client"

import { FC, ReactNode } from "react"
import { SearchProvider } from '@/lib/hooks/use-search'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface LayoutProps {
  children: ReactNode
}

const Providers: FC<LayoutProps> = ({ children }) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider >
        {children}
      </SearchProvider>
    </QueryClientProvider>
  )
}

export default Providers
