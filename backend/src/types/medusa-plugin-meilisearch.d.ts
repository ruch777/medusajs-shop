declare module 'medusa-plugin-meilisearch' {
  import { EventBusService, Logger } from "@medusajs/medusa"
  import { MeiliSearch } from "meilisearch"

  interface MeiliSearchPluginOptions {
    config: {
      host: string
      apiKey: string
      product?: {
        indexSettings?: {
          searchableAttributes?: string[]
          displayedAttributes?: string[]
          filterableAttributes?: string[]
        }
      }
    }
  }

  export class MeiliSearchService {
    constructor(
      { logger }: { logger: Logger },
      client: MeiliSearch
    )
    
    updateProducts(productIds: string[]): Promise<void>
    deleteProducts(productIds: string[]): Promise<void>
    getProductIndex(): any
  }
}