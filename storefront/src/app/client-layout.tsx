"use client"

import { Providers } from "@components/providers"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
    </Providers>
  )
}