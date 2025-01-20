import { sdk } from "@lib/config"
import { cache } from "react"
import { getProductsList } from "./products"
import { HttpTypes } from "@medusajs/types"
import { ProductPreviewType } from "../types/product"

export const retrieveCollection = cache(async function (id: string) {
  return sdk.store.collection
    .retrieve(id, {}, { next: { tags: ["collections"] } })
    .then(({ collection }) => collection)
})

export const getCollectionsList = cache(async function (
  offset: number = 0,
  limit: number = 100,
  timestamp?: number
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  try {
    const result = await sdk.store.collection.list(
      { limit, offset: 0 },
      {
        next: {
          tags: ["collections"],
        }
      }
    )
    
    return {
      collections: result.collections,
      count: result.collections.length
    }
  } catch (error) {
    console.error("Failed to fetch collections:", error)
    throw error
  }
})

export const getCollectionByHandle = cache(async function (
  handle: string
): Promise<HttpTypes.StoreCollection> {
  return sdk.store.collection
    .list({ handle }, { next: { tags: ["collections"] } })
    .then(({ collections }) => collections[0])
})

export const getCollectionsWithProducts = cache(
  async (countryCode: string): Promise<HttpTypes.StoreCollection[] | null> => {
    const { collections } = await getCollectionsList(0, 3)

    if (!collections) {
      return null
    }

    const collectionIds = collections
      .map((collection) => collection.id)
      .filter(Boolean) as string[]

    const { response } = await getProductsList({
      queryParams: { collection_id: collectionIds.join(",") },
      countryCode,
    })

    if (response.products) {
      response.products.forEach((product: any) => {
        const collection = collections.find(
          (collection) => collection.id === product.collection_id
        )

        if (collection) {
          if (!collection.products) {
            collection.products = []
          }

          collection.products.push(product)
        }
      })
    }

    return collections as unknown as HttpTypes.StoreCollection[]
  }
)
