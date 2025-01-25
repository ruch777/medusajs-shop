import { clx } from "@medusajs/ui"
import React from "react"
import {
  UseHitsProps,
  useHits,
  useSearchBox,
} from "react-instantsearch-hooks-web"

import { ProductHit } from "../hit"
import ShowAll from "../show-all"

type HitsProps<THit> = React.ComponentProps<"div"> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
    category?: "all" | "products" | "collections" | "categories"
  }

const Hits = ({
  hitComponent: Hit,
  className,
  category = "all",
  ...props
}: HitsProps<ProductHit>) => {
  const { query } = useSearchBox()
  const { hits } = useHits(props)

  const filteredHits = React.useMemo(() => {
    if (category === "all") return hits
    return hits.filter(hit => {
      switch (category) {
        case "products":
          return !hit.collection_id
        case "collections":
          return hit.collection_id
        case "categories":
          return hit.category_id
        default:
          return true
      }
    })
  }, [hits, category])

  return (
    <div
      className={clx(
        "transition-[height,max-height,opacity] duration-300 ease-in-out sm:overflow-hidden w-full mb-1 p-px",
        className,
        {
          "max-h-full opacity-100": !!query,
          "max-h-0 opacity-0": !query && !filteredHits.length,
        }
      )}
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
        data-testid="search-results"
      >
        {filteredHits.slice(0, 6).map((hit, index) => (
          <li
            key={index}
            className={clx("list-none", {
              "hidden sm:block": index > 2,
            })}
          >
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
      {filteredHits.length === 0 && query && (
        <div className="flex items-center justify-center py-4">
          <span className="text-ui-fg-subtle">No results found in {category}</span>
        </div>
      )}
      <ShowAll />
    </div>
  )
}

export default Hits
