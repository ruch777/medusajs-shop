import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return (
    <ul className="flex flex-col gap-y-8 list-none p-0">
      {collections.map((collection) => (
        <li key={collection.id} className="list-none">
          <ProductRail collection={collection} region={region} />
        </li>
      ))}
    </ul>
  )
}
