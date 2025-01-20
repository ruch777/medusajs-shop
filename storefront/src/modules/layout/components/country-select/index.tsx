"use client"

import { usePathname, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

interface CountrySelectProps {
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ regions }: CountrySelectProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleSelect = (countryCode: string) => {
    const path = pathname.split("/").slice(2).join("/")
    router.push(`/${countryCode}/${path}`)
  }

  const currentCountry = pathname.split("/")[1]

  return (
    <div className="relative">
      <select
        className="appearance-none bg-transparent border-none text-white focus:outline-none"
        value={currentCountry}
        onChange={(e) => handleSelect(e.target.value)}
      >
        {regions.map((region) => {
          return region.countries?.map((country) => (
            <option key={country.iso_2} value={country.iso_2}>
              {country.display_name}
            </option>
          )) || []
        })}
      </select>
    </div>
  )
}

export default CountrySelect
