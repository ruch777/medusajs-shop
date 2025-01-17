import { StoreProduct, StoreProductVariant } from "@medusajs/types"
import { ProductPreviewType } from "@lib/types/product"

export function transformProductPreview(
  product: StoreProduct,
  countryCode: string
): ProductPreviewType {
  const variants = product.variants as StoreProductVariant[] || []
  const prices = variants[0]?.prices || []
  const price = prices.find((p: any) => p.currency_code === countryCode)

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.thumbnail,
    price: price ? {
      calculated_price: price.amount.toString(),
      original_price: price.amount.toString(),
      difference: "0",
      price_type: "default"
    } : undefined,
    variants: variants,
    collection_id: product.collection_id || undefined
  }
}