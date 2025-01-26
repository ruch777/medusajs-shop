import { MeiliSearch, SearchResponse } from 'meilisearch'
import { InstantMeiliSearchInstance } from '@meilisearch/instant-meilisearch'

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

const searchEndpoint = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || 'http://localhost:7700'
const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || ''

const client = new MeiliSearch({
  host: searchEndpoint,
  apiKey: apiKey
})

export const searchClient: InstantMeiliSearchInstance = {
  search: async (requests: SearchRequest[]) => {
    const results = await Promise.all(
      requests.map(async (request) => {
        const res = await client.index(request.indexName).search(request.query || "", {
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
