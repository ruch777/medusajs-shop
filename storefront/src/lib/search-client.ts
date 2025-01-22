import { MeiliSearch } from 'meilisearch'

export const SEARCH_INDEX_NAME = "products"
export const searchClientInstance = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || 'masterKey'
})
