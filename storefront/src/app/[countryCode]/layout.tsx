"use client"

import { CartProvider } from "@lib/context/cart-context"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@lib/config"
import { MedusaProvider } from "medusa-react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <MedusaProvider 
        queryClientProviderProps={{ client: queryClient }}
        baseUrl={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </MedusaProvider>
    </QueryClientProvider>
  )
} 