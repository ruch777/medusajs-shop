import { cache } from "react"
import { getProductsList } from "./products"
import { HttpTypes } from "@medusajs/types"
import { ProductPreviewType } from "../types/product"
import { medusaClient } from "@lib/config"

export const retrieveCollection = cache(async function (id: string) {
  const { collection } = await medusaClient.collections.retrieve(id, {
    next: { 
      tags: ["collections"] 
    }
  })
  return collection
})

export const getCollectionsList = cache(async function (
  limit = 100
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  try {
    const { collections } = await medusaClient.collections.list(
      { limit, offset: 0 },
      {
        next: {
          tags: ["collections"]
        }
      }
    )
    return {
      collections,
      count: collections.length
    }
  } catch (error) {
    throw error
  }
})

export const getCollectionByHandle = cache(async function (
  handle: string
): Promise<HttpTypes.StoreCollection> {
  const { collections } = await medusaClient.collections.list(
    { handle },
    {
      next: {
        tags: ["collections"]
      }
    }
  )
  return collections[0]
})

export const getCollectionsWithProducts = cache(
  async (countryCode: string): Promise<HttpTypes.StoreCollection[] | null> => {
    const { collections } = await getCollectionsList()

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
      response.products.forEach((product) => {
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

    return collections
  }
)
