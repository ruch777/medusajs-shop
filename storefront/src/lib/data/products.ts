import { ProductType, ProductPreviewType, ProductListType } from "../types/product"
import { transformProductPreview } from "../util/transform-product"
import { client } from "../config"
import { StoreProduct } from "@medusajs/types"

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
  queryParams?: Record<string, string>
  countryCode: string
}): Promise<ProductListType> {
  try {
    const { products, count } = await client.product.list({
      limit: 12,
      offset: pageParam * 12,
      ...queryParams,
    })

    return {
      products: (products || []).map((product: StoreProduct) => 
        transformProductPreview(product, countryCode)
      ),
      count: count || 0,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      products: [],
      count: 0
    }
  }
}

export async function getProductByHandle(
  handle: string
): Promise<{ product: StoreProduct }> {
  try {
    const { product } = await client.product.retrieve(handle)

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

export async function getProductsById(ids: string[]): Promise<StoreProduct[]> {
  try {
    const { products } = await client.product.list({
      id: ids,
    })
    return products
  } catch (error) {
    console.error('Error fetching products by ids:', error)
    return []
  }
}
