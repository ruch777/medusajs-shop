import { medusaClient } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cache } from "react"

interface Region {
  id: string
  name: string
  countries: Country[]
  currency_code: string
  tax_rate: number
}

interface Country {
  iso_2: string
  iso_3: string
  num_code: string
  name: string
  display_name: string
}

export const listRegions = cache(async (): Promise<Region[]> => {
  try {
    const { regions } = await medusaClient.regions.list()
    return regions
  } catch (error) {
    throw medusaError(error)
  }
})

export const retrieveRegion = cache(async (id: string): Promise<Region> => {
  try {
    const { region } = await medusaClient.regions.retrieve(id)
    return region
  } catch (error) {
    throw medusaError(error)
  }
})

export const getAllCountryCodes = cache(async (): Promise<Record<string, string>> => {
  const regions = await listRegions()
  return regions.reduce((acc, region) => {
    region.countries.forEach(country => {
      acc[country.iso_2.toLowerCase()] = region.id
    })
    return acc
  }, {} as Record<string, string>)
})

export const getRegionByCountryCode = cache(async (
  countryCode: string
): Promise<Region | undefined> => {
  const regions = await listRegions()
  const normalizedCode = countryCode.toLowerCase()
  return regions.find(region => 
    region.countries.some(country => 
      country.iso_2.toLowerCase() === normalizedCode
    )
  )
})
