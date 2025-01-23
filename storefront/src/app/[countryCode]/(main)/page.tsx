import { Metadata } from "next"
import type { StoreProductCategory } from "@medusajs/types"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CollectionGrid from "@modules/home/components/collection-grid"
import CategoryGrid from "@modules/home/components/category-grid"
import Newsletter from "@modules/home/components/newsletter"
import ProductOverview from "@modules/home/components/product-overview"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { getProductsList } from "@lib/data/products"

export const metadata: Metadata = {
  title: "ÉPiCeY - Épices de Ceylan (Spices of Ceylon)",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)
  const categories = await listCategories()
  
  // Get latest products for the overview section
  const { response: { products } } = await getProductsList({
    queryParams: {
      limit: 6
    },
    countryCode
  })

  if (!collections || !region) {
    return null
  }

  return (
    <div className="flex flex-col min-h-[100vh]">
      <Hero />
      <main className="flex-1">
        <CollectionGrid collections={collections} />
        <ProductOverview products={products} region={region} title="Latest Products" />
        <CategoryGrid categories={categories as unknown as StoreProductCategory[]} />
        <section className="py-12">
          <div className="content-container">
            <FeaturedProducts collections={collections} region={region} />
          </div>
        </section>
        <Newsletter />
      </main>
    </div>
  )
}
