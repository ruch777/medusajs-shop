import { medusaClient } from "@lib/config"
import { searchClientInstance, SEARCH_INDEX_NAME } from "@lib/search-client"
import { StoreProduct } from "@lib/types/product"
import { transformProduct } from "@lib/util/transform-product"

// ... (keep existing imports and other code)

export async function searchProducts(
  query: string,
  { offset = 0, limit = 24, sort }: { offset?: number; limit?: number; sort?: string[] } = {}
) {
  try {
    const index = searchClientInstance.index(SEARCH_INDEX_NAME);
    const results = await index.search<StoreProduct>(query, {
      offset,
      limit,
      sort,
      attributesToRetrieve: ['id', 'title', 'handle', 'thumbnail', 'variants'],
      attributesToCrop: ['description'],
      cropLength: 50,
    });

    return results.hits.map((hit) => transformProduct(hit));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getProductByHandle(handle: string): Promise<StoreProduct | null> {
  try {
    const index = searchClientInstance.index(SEARCH_INDEX_NAME);
    const product = await index.getDocument<StoreProduct>(handle);
    return transformProduct(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    return null;
  }
}

export async function getFeaturedProducts() {
  const { products } = await medusaClient.products.list({
    limit: 4,
    fields: ["id", "title", "handle", "thumbnail", "description", "variants"],
    expand: ["variants", "variants.prices"],
    filter: {
      is_featured: true
    }
  })

  return products
}

// ... (rest of the file remains unchanged)
