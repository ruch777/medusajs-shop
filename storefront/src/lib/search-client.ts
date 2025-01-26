import { MeiliSearch, SearchResponse } from 'meilisearch'

const searchEndpoint = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://localhost:7700"
const searchApiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY
export const SEARCH_INDEX_NAME = process.env.NEXT_PUBLIC_INDEX_NAME || "products"

export const searchClient = new MeiliSearch({
  host: searchEndpoint,
  apiKey: searchApiKey,
})

interface SearchResult {
  hits: Record<string, any>[]
  estimatedTotalHits?: number
  processingTimeMs: number
  query: string
}

// Create a wrapper for compatibility with InstantSearch
const searchWrapper = {
  search(requests: any[]) {
    const searchPromises = requests.map((request) => {
      const { indexName, query, params } = request
      
      // Transform params to MeiliSearch format
      const searchParams: any = {
        limit: params?.hitsPerPage,
        offset: params?.page ? params.page * (params?.hitsPerPage || 20) : 0,
      }

      // Add filter if present
      if (params?.filters) {
        searchParams.filter = params.filters
      }

      return searchClient
        .index(indexName)
        .search(query || "", searchParams)
        .then((res: SearchResult) => ({
          hits: res.hits,
          nbHits: res.estimatedTotalHits || 0,
          nbPages: Math.ceil((res.estimatedTotalHits || 0) / (params?.hitsPerPage || 20)),
          page: params?.page || 0,
          processingTimeMS: res.processingTimeMs,
          query: res.query || "",
        }))
    })

    return Promise.all(searchPromises).then((results) => ({ results }))
  },
}

export default searchWrapper
