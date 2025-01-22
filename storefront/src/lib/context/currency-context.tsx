"use client"

import { createContext, useContext } from "react"
import { useLocale } from "@lib/hooks/use-locale"

interface CurrencyContext {
  currency?: { code: string; symbol: string } | null
}

const CurrencyContext = createContext<CurrencyContext | null>(null)

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale } = useLocale()

  const currency = locale === "en-US"
    ? { code: "USD", symbol: "$" }
    : locale === "de-DE"
      ? { code: "EUR", symbol: "€" }
      : null

  return (
    <CurrencyContext.Provider value={{ currency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }

  return context
}