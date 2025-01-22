import Medusa from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"

// Initialize the query client
export const queryClient = new QueryClient()

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

let _sdk: Medusa | null = null
let _publishableApiKey: string | null = null

export async function getSDK(): Promise<Medusa> {
  if (!_sdk || !_publishableApiKey) {
    try {
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/publishable-api-keys`)
      const { publishable_api_keys } = await response.json()
      _publishableApiKey = publishable_api_keys[0]?.id

      if (!_publishableApiKey) {
        throw new Error("No publishable API key found")
      }

      _sdk = new Medusa({
        baseUrl: MEDUSA_BACKEND_URL,
        maxRetries: 3,
        publishableApiKey: _publishableApiKey
      })
    } catch (error) {
      console.error('Failed to initialize Medusa client:', error)
      throw error
    }
  }
  return _sdk
} 