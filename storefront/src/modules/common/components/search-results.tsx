import { Product } from "@medusajs/medusa"
import { cn } from "@lib/util/cn"
import { XMark } from "@medusajs/icons"
import { Button } from "@components/ui/button"
import ProductPreview from "../../products/components/product-preview"

type SearchResultsProps = {
  products: Product[]
  facets?: Record<string, number>
  isLoading: boolean
  onSelectResult: (product: Product) => void
  className?: string
}

const SearchResults = ({
  products,
  facets,
  isLoading,
  onSelectResult,
  className
}: SearchResultsProps) => {
  return (
    <div className={cn("bg-ui-bg-base shadow-elevation-card-rest rounded-lg p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-ui-fg-base text-small-semibold">
          {products.length} results
        </h3>
        <Button variant="transparent" size="small" onClick={() => onSelectResult}>
          <XMark className="text-ui-fg-muted" />
        </Button>
      </div>

      {isLoading ? (
        <div className="text-ui-fg-muted text-small-regular animate-pulse">
          Searching...
        </div>
      ) : products.length === 0 ? (
        <p className="text-ui-fg-muted text-small-regular">No results found</p>
      ) : (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductPreview
                key={product.id}
                product={product}
                onClick={() => onSelectResult(product)}
                className="cursor-pointer hover:bg-ui-bg-base-hover transition-colors"
              />
            ))}
          </div>

          {facets && Object.keys(facets).length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-ui-fg-base text-small-semibold mb-2">Filters</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(facets).map(([facet, count]) => (
                  <Button
                    key={facet}
                    variant="secondary"
                    size="small"
                    className="rounded-full"
                  >
                    {facet} ({count})
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchResults