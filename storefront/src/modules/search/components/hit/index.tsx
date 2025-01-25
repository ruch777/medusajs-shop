import { Container, Text } from "@medusajs/ui"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export type ProductHit = {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: HttpTypes.StoreProductVariant[]
  collection_handle: string | null
  collection_id: string | null
  collection_title: string | null
  category_id: string | null
  category_handle: string | null
  category_name: string | null
}

type HitProps = {
  hit: ProductHit
}

const Hit = ({ hit }: HitProps) => {
  const isCollection = hit.collection_id
  const isCategory = hit.category_id

  return (
    <LocalizedClientLink
      href={`/${isCollection ? 'collections' : isCategory ? 'categories' : 'products'}/${hit.handle}`}
      data-testid="search-result"
    >
      <Container
        key={hit.id}
        className="flex sm:flex-col gap-4 w-full p-4 shadow-elevation-card-rest hover:shadow-elevation-card-hover items-center sm:justify-center group"
      >
        <Thumbnail
          thumbnail={hit.thumbnail}
          size="square"
          className="h-16 w-16 sm:h-full sm:w-full"
        />
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col">
            <Text
              className="text-ui-fg-base font-medium"
              data-testid="search-result-title"
            >
              {hit.title}
            </Text>
            {(hit.collection_title || hit.category_name) && (
              <Text className="text-ui-fg-subtle text-sm">
                {isCollection ? hit.collection_title : hit.category_name}
              </Text>
            )}
          </div>
          {hit.description && (
            <Text className="text-ui-fg-subtle text-sm line-clamp-2 mt-2">
              {hit.description}
            </Text>
          )}
        </div>
      </Container>
    </LocalizedClientLink>
  )
}

export default Hit
