import { ProductType, ProductPreviewType, ProductListType } from "../types/product"
import { transformProductPreview } from "../util/transform-product"
import { client } from "../config"
import { StoreProduct } from "@medusajs/types"
import { sortProducts } from "../util/sort-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export interface Spice {
  id: string
  name: string
  description: string
  image: string
  price: number
  region: string
  rating: number
  isFeatured: boolean
}

export async function getProductsList({
  pageParam = 0,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: Record<string, any>
  countryCode: string
}): Promise<{ response: { products: StoreProduct[]; count: number } }> {
  try {
    // Transform query params to handle IDs correctly
    const transformedParams = { ...queryParams }
    
    // Handle product IDs
    if (transformedParams.id?.ids) {
      // Ensure ids is an array of strings
      const ids = Array.isArray(transformedParams.id.ids) 
        ? transformedParams.id.ids 
        : [transformedParams.id.ids]
      transformedParams.id = ids.filter((id: string | unknown): id is string => typeof id === 'string')
    }

    // Handle region ID separately
    if (transformedParams.id?.regionId) {
      transformedParams.region_id = transformedParams.id.regionId
      delete transformedParams.id.regionId
    }

    const { products, count } = await client.product.list({
      limit: 12,
      offset: pageParam * 12,
      ...transformedParams,
    })

    return {
      response: {
        products: products || [],
        count: count || 0,
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      response: {
        products: [],
        count: 0
      }
    }
  }
}

export async function getProductsListWithSort({
  page = 1,
  queryParams,
  sortBy,
  countryCode,
}: {
  page?: number
  queryParams?: Record<string, any>
  sortBy?: SortOptions
  countryCode: string
}) {
  const { response } = await getProductsList({
    pageParam: page - 1,
    queryParams: {
      ...queryParams,
      order: sortBy === "created_at" ? sortBy : undefined,
    },
    countryCode,
  })

  if (sortBy && sortBy !== "created_at") {
    response.products = sortProducts(response.products, sortBy)
  }

  return { response }
}

export async function getProductByHandle(
  handle: string,
  regionId?: string
): Promise<{ product: StoreProduct }> {
  try {
    // First try to get the product by handle using list with handle filter
    const { products } = await client.product.list({
      handle: handle,
      region_id: regionId
    })

    // Get the first product from the results
    const product = products?.[0]

    if (!product) {
      throw new Error(`Product with handle ${handle} not found`)
    }

    return { product }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export async function getFeaturedSpices(): Promise<Spice[]> {
  try {
    const response = await fetch('/api/spices/featured')
    if (!response.ok) throw new Error('Failed to fetch featured spices')
    return await response.json()
  } catch (error) {
    console.error('Error fetching featured spices:', error)
    return []
  }
}

export async function getProductsById({ ids, regionId }: { ids: string[], regionId?: string }): Promise<StoreProduct[]> {
  try {
    // Ensure ids is an array and filter out any non-string values
    const productIds = (Array.isArray(ids) ? ids : [ids]).filter(id => typeof id === 'string')
    
    if (productIds.length === 0) {
      return []
    }

    const { products } = await client.product.list({
      id: productIds,
      region_id: regionId
    })
    return products
  } catch (error) {
    console.error('Error fetching products by ids:', error)
    return []
  }
}
