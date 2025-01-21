import { MeiliSearch } from 'meilisearch'

// Validate environment variables
const SEARCH_ENDPOINT = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT
const SEARCH_API_KEY = process.env.NEXT_PUBLIC_SEARCH_API_KEY

if (!SEARCH_ENDPOINT) {
  console.error('Missing NEXT_PUBLIC_SEARCH_ENDPOINT environment variable')
}

if (!SEARCH_API_KEY) {
  console.error('Missing NEXT_PUBLIC_SEARCH_API_KEY environment variable')
}

export const searchClient = new MeiliSearch({
  host: SEARCH_ENDPOINT || 'http://localhost:7700',
  apiKey: SEARCH_API_KEY,
  requestConfig: {
    headers: {
      'Content-Type': 'application/json',
    }
  }
})

// Test the connection
searchClient.health().catch(error => {
  console.error('MeiliSearch connection error:', error)
})

export const SEARCH_INDEX_NAME = process.env.NEXT_PUBLIC_INDEX_NAME || 'products' 