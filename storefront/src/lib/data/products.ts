""


import { medusaClient } from "@lib/config"
import { searchClientInstance, SEARCH_INDEX_NAME } from "@lib/search-client"
import { ProductPreviewType } from "@lib/types/product"
import { transformProductPreview } from "@lib/util/transform-product"
import { useLocale } from "@lib/hooks/use-locale"
import { StoreProduct } from "@medusajs/types"

// ... (keep existing imports and other code)

// export async function searchProducts(
//   query: string,
//   { offset = 0, limit = 24, sort }: { offset?: number; limit?: number; sort?: string[] } = {}
// ) {
//   const { locale } = useLocale()
//   try {
//     const index = searchClientInstance.index(SEARCH_INDEX_NAME);
//     const results = await index.search<StoreProduct>(query, {
//       offset,
//       limit,
//       sort,
//       attributesToRetrieve: ['id', 'title', 'handle', 'thumbnail', 'variants'],
//       attributesToCrop: ['description'],
//       cropLength: 50,
//     });

//     return results.hits.map((hit) => transformProductPreview(hit, locale)) as ProductPreviewType[];
//   } catch (error) {
//     console.error('Search error:', error);
//     return [];
//   }
// }

// export async function getProductByHandle(handle: string): Promise<ProductPreviewType | null> {
//   const { locale } = useLocale()
//   try {
//     const index = searchClientInstance.index(SEARCH_INDEX_NAME);
//     const product = await index.getDocument<StoreProduct>(handle);
//     if (!product) {
//       return null;
//     }
//     return transformProductPreview(product, locale) as ProductPreviewType;
//   } catch (error) {
//     console.error('Product fetch error:', error);
//     return null;
//   }
// }

// export async function getFeaturedProducts() {
//   const { products } = await medusaClient.products.list({
//     limit: 4,
//     fields: ["id", "title", "handle", "thumbnail", "description", "variants"],
//     expand: ["variants", "variants.prices"],
//     filter: {
//       is_featured: true
//     }
//   })

//   return products
// }

// ... (rest of the file remains unchanged)
