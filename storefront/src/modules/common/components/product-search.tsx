"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@components/ui/button"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import { Product } from "@lib/types/product"
import { Text } from "@medusajs/ui"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ProductSearchProps {
  onSelect?: (product: Product) => void
}

export default function ProductSearch({ onSelect }: ProductSearchProps) {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const addToRecentSearches = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  useEffect(() => {
    if (!query) {
      setProducts([])
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(true)
      searchClient
        .index(SEARCH_INDEX_NAME)
        .search(query, { limit: 5 })
        .then((res) => {
          setProducts(res.hits)
          if (res.hits.length > 0) {
            addToRecentSearches(query)
          }
        })
        .catch((err) => {
          console.error("Error searching products", err)
          setProducts([])
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, 300) // Debounce search

    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSelect = (product: any) => {
    setQuery("")
    if (onSelect) {
      onSelect(product)
    } else {
      router.push(`/products/${product.handle}`)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/results/${query}`)
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="flex items-center border rounded-lg w-full bg-white shadow-sm">
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 w-full focus:outline-none rounded-l-lg"
          value={query}
          onChange={handleSearch}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          type="submit"
          className="ml-auto px-4 py-2 h-full rounded-r-lg hover:bg-gray-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          ) : (
            <Search className="h-5 w-5 text-gray-500" />
          )}
        </Button>
      </form>

      {/* Dropdown for results or recent searches */}
      {(query || (!query && recentSearches.length > 0)) && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-50 max-h-[80vh] overflow-y-auto">
          {query ? (
            // Search Results
            <>
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
                  <Text className="text-ui-fg-subtle mt-2">Searching...</Text>
                </div>
              ) : products.length > 0 ? (
                <>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 border-b last:border-b-0"
                      onClick={() => handleSelect(product)}
                    >
                      {product.thumbnail && (
                        <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <Text className="text-ui-fg-base font-medium">{product.title}</Text>
                        {product.description && (
                          <Text className="text-ui-fg-subtle text-sm line-clamp-1">
                            {product.description}
                          </Text>
                        )}
                      </div>
                    </div>
                  ))}
                  {products.length === 5 && (
                    <Button
                      variant="ghost"
                      className="w-full py-3 text-sm text-ui-fg-subtle hover:text-ui-fg-base"
                      onClick={() => router.push(`/results/${query}`)}
                    >
                      View all results
                    </Button>
                  )}
                </>
              ) : (
                <div className="p-4 text-center">
                  <Text className="text-ui-fg-subtle">No products found</Text>
                </div>
              )}
            </>
          ) : (
            // Recent Searches
            <div className="p-4">
              <Text className="text-ui-fg-subtle mb-2 text-sm">Recent Searches</Text>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}