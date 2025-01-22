interface Currency {
  code: string
  decimal_digits: number
  symbol?: string
}

export const formatAmount = (
  amount: number,
  currency: Currency,
  locale?: string
) => {
  try {
    const majorValue = amount / Math.pow(10, currency.decimal_digits)
    return new Intl.NumberFormat(locale || "en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.decimal_digits,
      maximumFractionDigits: currency.decimal_digits
    }).format(majorValue)
  } catch (error) {
    console.error("Currency formatting failed:", error)
    const fallbackValue = (amount / Math.pow(10, currency.decimal_digits)).toFixed(currency.decimal_digits)
    return currency.symbol 
      ? `${currency.symbol}${fallbackValue}`
      : `${currency.code} ${fallbackValue}`
  }
}