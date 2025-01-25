import { MeiliSearch } from 'meilisearch'

const SEARCH_ENDPOINT = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://localhost:7700"
const SEARCH_API_KEY = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "your-master-key"
const SEARCH_INDEX_NAME = process.env.NEXT_PUBLIC_INDEX_NAME || "products"

interface AlgoliaSearchParams {
  query?: string
  page?: number
  hitsPerPage?: number
  filters?: string
  sort?: string[]
}

interface AlgoliaSearchRequest {
  indexName: string
  params: AlgoliaSearchParams
}

interface AlgoliaSearchResponse {
  hits: any[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  processingTimeMS: number
  query: string
}

// Initialize the client
const client = new MeiliSearch({
  host: SEARCH_ENDPOINT,
  apiKey: SEARCH_API_KEY
})

const productsIndex = client.index(SEARCH_INDEX_NAME)

// Create a custom search client that transforms Algolia queries to MeiliSearch format
export const searchClient = {
  search(requests: AlgoliaSearchRequest[]): Promise<{ results: AlgoliaSearchResponse[] }> {
    if (!requests?.length) {
      return Promise.resolve({
        results: []
      })
    }

    // Transform Algolia request format to MeiliSearch
    const { params } = requests[0]
    
    return productsIndex
      .search(params.query || "", {
        limit: params.hitsPerPage,
        offset: params.page ? params.page * (params.hitsPerPage || 20) : 0,
        filter: params.filters,
        sort: params.sort,
      })
      .then(res => ({
        results: [{
          hits: res.hits || [],
          nbHits: (res as any).estimatedTotalHits || 0,
          page: params.page || 0,
          nbPages: Math.ceil(((res as any).estimatedTotalHits || 0) / (params.hitsPerPage || 20)),
          hitsPerPage: params.hitsPerPage || 20,
          processingTimeMS: res.processingTimeMs || 0,
          query: params.query || ""
        }]
      }))
      .catch(error => {
        console.error("MeiliSearch error:", error)
        return { results: [] }
      })
  }
}
