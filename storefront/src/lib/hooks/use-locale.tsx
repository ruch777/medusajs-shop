import { useParams } from "next/navigation"

export const useLocale = () => {
  const params = useParams()
  const locale = params?.countryCode as string | undefined

  return { locale: locale || "en-US" }
}