"use client"
import { Text } from "@medusajs/ui"
import type { StoreProductListResponse, StoreRegionListResponse } from "@medusajs/types"
import { motion } from "framer-motion"
import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PricedProduct = StoreProductListResponse["products"][0]
type Region = StoreRegionListResponse["regions"][0]

interface MoneyAmount {
  amount: number
  currency_code: string
}

interface ProductPreviewProps {
  product: PricedProduct
  region: Region
  isFeatured?: boolean
}

const ProductPreview = ({ product, region }: ProductPreviewProps) => {
  const getPrice = () => {
    const variant = product.variants?.[0]
    if (!variant) return "0.00"

    const amount = (variant as any).prices?.find(
      (p: MoneyAmount) => p.currency_code === region.currency_code
    )?.amount

    return amount ? (amount / 100).toFixed(2) : "0.00"
  }

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div className="aspect-[9/16] w-full relative bg-gray-100 rounded-lg overflow-hidden">
        {product.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title}
            className="absolute inset-0 object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-2">
        <Text className="text-base-regular">{product.title}</Text>
        <Text className="text-base-regular text-gray-600">
          {region.currency_code.toUpperCase()} {getPrice()}
        </Text>
      </div>
    </LocalizedClientLink>
  )
}

interface ProductOverviewProps {
  products: PricedProduct[]
  region: Region
  title?: string
}

const ProductOverviewSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[9/16] w-full bg-gray-100 rounded-lg" />
          <div className="mt-2 w-2/3 h-4 bg-gray-100 rounded" />
          <div className="mt-1 w-1/3 h-4 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}

const ProductOverview = ({ products, region, title = "New Arrivals" }: ProductOverviewProps) => {
  if (!products?.length) {
    return null
  }

  return (
    <div className="py-12 content-container">
      <div className="mb-8">
        <Text className="text-2xl-semi">{title}</Text>
      </div>
      <Suspense fallback={<ProductOverviewSkeleton />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ProductPreview product={product} region={region} />
            </motion.div>
          ))}
        </div>
      </Suspense>
    </div>
  )
}

export default ProductOverview 