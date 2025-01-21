import { MeiliSearch, SearchParams, SearchResponse, Index } from "meilisearch"
import { StoreProduct } from "@medusajs/types"

export const SEARCH_INDEX_NAME = "products"

// Extend MeiliSearch type to include our custom search method
interface CustomMeiliSearch extends MeiliSearch {
  search<T extends StoreProduct>(
    query: string,
    options?: SearchParams
  ): Promise<SearchResponse<T>>
}

export const searchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://localhost:7700",
  apiKey: process.env.NEXT_PUBLIC_SEARCH_API_KEY
}) as CustomMeiliSearch

// Type-safe wrapper for MeiliSearch client
class SearchClient {
  private static instance: SearchClient
  private isInitialized: boolean = false
  private initializationError: Error | null = null
  private productsIndex: Index

  private constructor() {
    this.productsIndex = searchClient.index(SEARCH_INDEX_NAME)
    this.initialize()
  }

  public static getInstance(): SearchClient {
    if (!SearchClient.instance) {
      SearchClient.instance = new SearchClient()
    }
    return SearchClient.instance
  }

  private async initialize() {
    try {
      await searchClient.health()
      this.isInitialized = true
    } catch (error) {
      this.initializationError = error as Error
      console.error('Failed to initialize MeiliSearch:', error)
    }
  }

  public async search<T extends StoreProduct>(
    query: string, 
    options?: SearchParams
  ): Promise<SearchResponse<T>> {
    if (!this.isInitialized) {
      if (this.initializationError) {
        throw new Error(`MeiliSearch is not available: ${this.initializationError.message}`)
      }
      await this.initialize()
    }

    try {
      const response = await this.productsIndex.search<T>(query, options)
      return response as SearchResponse<T>
    } catch (error) {
      console.error('Search failed:', error)
      throw error
    }
  }

  public async getByHandle<T extends StoreProduct>(handle: string): Promise<T | null> {
    try {
      const response = await this.search<T>('', {
        filter: [`handle = '${handle}'`],
        limit: 1
      })

      return response.hits[0] || null
    } catch (error) {
      console.error('Failed to get product by handle:', error)
      return null
    }
  }
}

export const searchClientInstance = SearchClient.getInstance()

// For compatibility with existing code
searchClient.search = <T extends StoreProduct>(query: string, options?: SearchParams): Promise<SearchResponse<T>> => {
  return searchClientInstance.search<T>(query, options)
}
