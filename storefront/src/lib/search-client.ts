import { MeiliSearch } from 'meilisearch'
import { InstantMeiliSearchInstance } from '@meilisearch/instant-meilisearch'
import Medusa from "@medusajs/medusa-js"

// Initialize Medusa client
const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  maxRetries: 3,
})

interface SearchRequest {
  indexName: string
  query?: string
  params?: {
    filter?: string[]
    limit?: number
    page?: number
  }
}

interface SearchResult {
  hits: Record<string, any>[]
  nbHits: number
  nbPages: number
  page: number
  processingTimeMS: number
  query: string
}

interface ProductVariant {
  sku: string | null
  prices: Array<{ amount: number }>
}

interface Product {
  id: string
  title: string
  description: string | null
  handle: string | null
  thumbnail: string | null
  variants: ProductVariant[]
  collection?: {
    title: string | null
    handle: string | null
  }
  created_at: string
  updated_at: string
}

const searchEndpoint = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || 'http://localhost:7700'
const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || ''
const useMeiliSearch = process.env.NEXT_PUBLIC_USE_MEILISEARCH === 'true'

// Initialize MeiliSearch client if enabled
const meiliClient = useMeiliSearch ? new MeiliSearch({
  host: searchEndpoint,
  apiKey: apiKey
}) : null

// Fallback search using Medusa API
const fallbackSearch = async (request: SearchRequest): Promise<SearchResult> => {
  try {
    const { products, count } = await medusaClient.products.search({
      q: request.query || "",
      limit: request.params?.limit || 20,
      offset: (request.params?.page || 0) * (request.params?.limit || 20)
    })

    return {
      hits: products.map((p: Product) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        handle: p.handle,
        thumbnail: p.thumbnail,
        variant_sku: p.variants?.map((v: ProductVariant) => v.sku),
        collection_title: p.collection?.title,
        collection_handle: p.collection?.handle,
        price: p.variants?.[0]?.prices?.[0]?.amount,
        created_at: p.created_at,
        updated_at: p.updated_at
      })),
      nbHits: count,
      nbPages: Math.ceil(count / (request.params?.limit || 20)),
      page: request.params?.page || 0,
      processingTimeMS: 0,
      query: request.query || ""
    }
  } catch (error) {
    console.error("Error in fallback search:", error)
    return {
      hits: [],
      nbHits: 0,
      nbPages: 0,
      page: 0,
      processingTimeMS: 0,
      query: request.query || ""
    }
  }
}

export const searchClient: InstantMeiliSearchInstance = {
  search: async (requests: SearchRequest[]) => {
    if (!useMeiliSearch || !meiliClient) {
      // Use fallback search when MeiliSearch is disabled
      const results = await Promise.all(requests.map(fallbackSearch))
      return { results }
    }

    // Use MeiliSearch when enabled
    const results = await Promise.all(
      requests.map(async (request) => {
        const res = await meiliClient.index(request.indexName).search(request.query || "", {
          filter: request.params?.filter,
          limit: request.params?.limit || 20,
          offset: (request.params?.page || 0) * (request.params?.limit || 20)
        })

        return {
          hits: res.hits || [],
          nbHits: (res as any).estimatedTotalHits || 0,
          nbPages: Math.ceil(((res as any).estimatedTotalHits || 0) / (request.params?.limit || 20)),
          page: (request.params?.page || 0),
          processingTimeMS: res.processingTimeMs || 0,
          query: request.query || "",
        } as SearchResult
      })
    )

    return { results }
  }
}

export const SEARCH_INDEX_NAME = process.env.NEXT_PUBLIC_INDEX_NAME || "products"
