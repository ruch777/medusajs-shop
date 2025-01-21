const { loadEnv } = require("@medusajs/utils")
const { default: MeiliSearch } = require("meilisearch")

type Options = {
  force?: boolean
}

async function initMeilisearch({ force = false }: Options = {}) {
  loadEnv(process.env.NODE_ENV, process.cwd())

  const client = new MeiliSearch({
    host: process.env.MEILISEARCH_HOST || "",
    apiKey: process.env.MEILISEARCH_API_KEY
  })

  try {
    // 1. Initialize products index
    const productsIndex = client.index("products")
    
    // Check if index exists by trying to get its stats
    const indexExists = await productsIndex.getStats().catch(() => null)
    
    if (!indexExists || force) {
      console.log("Creating products index...")
      // Delete if exists
      await productsIndex.delete().catch(() => null)
      
      console.log("Updating index settings...")
      await productsIndex.updateSettings({
        searchableAttributes: [
          "title",
          "description",
          "variant_sku",
          "handle"
        ],
        displayedAttributes: [
          "title",
          "description",
          "variant_sku",
          "thumbnail",
          "handle",
          "id",
          "collection_id",
          "collection",
          "variants",
          "options",
          "images",
          "weight",
          "height",
          "length",
          "width"
        ],
        filterableAttributes: ["collection_handle", "tags"],
        sortableAttributes: ["created_at"],
        rankingRules: [
          "words",
          "typo",
          "proximity",
          "attribute",
          "sort",
          "exactness"
        ]
      })
    }

    // 2. Seed initial data
    console.log("Seeding initial products...")
    const { ProductService } = require("@medusajs/medusa/dist/services")
    const productService = new ProductService()
    const products = await productService.list({}, {
      relations: ["variants", "collection", "tags"]
    })
    
    // Index products
    await productsIndex.addDocuments(products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      handle: p.handle,
      thumbnail: p.thumbnail,
      variant_sku: p.variants?.map(v => v.sku).filter(Boolean),
      collection_id: p.collection_id,
      collection: p.collection,
      variants: p.variants,
      options: p.options,
      images: p.images,
      weight: p.weight,
      height: p.height,
      length: p.length,
      width: p.width
    })))

    console.log("✅ Meilisearch initialization completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("❌ Meilisearch initialization failed:", error)
    process.exit(1)
  }
}

module.exports = initMeilisearch