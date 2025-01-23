import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CollectionGrid from "@modules/home/components/collection-grid"
import CategoryGrid from "@modules/home/components/category-grid"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"

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

  if (!collections || !region) {
    return null
  }

  return (
    <div className="flex flex-col min-h-[100vh]">
      <Hero />
      <main className="flex-1">
        <CollectionGrid collections={collections} />
        <CategoryGrid categories={categories} />
        <section className="py-12">
          <div className="content-container">
            {/* @ts-expect-error Server Component */}
            <FeaturedProducts collections={collections} region={region} />
          </div>
        </section>
      </main>
    </div>
  )
}
