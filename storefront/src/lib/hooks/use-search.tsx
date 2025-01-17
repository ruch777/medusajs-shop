import { useState, useEffect } from "react"
import { Product } from "@lib/types/product"
import { searchClient } from "@lib/search-client"

export function useSearch(query: string) {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setProducts(null)
      return
    }

    setIsLoading(true)
    searchClient
      .index("products")
      .search(query, { limit: 5 })
      .then((res) => {
        setProducts(
          res.hits.map((hit: any) => ({
            id: hit.id,
            title: hit.title,
            handle: hit.handle,
            thumbnail: hit.thumbnail,
          }))
        )
      })
      .catch((err) => {
        console.error("Error searching products", err)
        setProducts(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [query])

  return { products, isLoading }
}