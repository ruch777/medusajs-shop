import { MeiliSearch, SearchParams, SearchResponse } from "meilisearch"

export const SEARCH_INDEX_NAME = "products"

export const searchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "your-master-key",
})

declare module "meilisearch" {
  interface MeiliSearch {
    search<T = any>(
      query: string,
      options?: SearchParams
    ): Promise<SearchResponse<T>>
  }
  
  // Using declaration merging to add a search method to the MeiliSearch interface
}


searchClient.search = (query, options) => {
  return searchClient.index(SEARCH_INDEX_NAME).search(query, options)
}
