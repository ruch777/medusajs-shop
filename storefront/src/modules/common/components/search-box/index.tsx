"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { searchClientInstance } from "@lib/search-client"
import { StoreProduct } from "@medusajs/types"
import { debounce } from "lodash"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams } from "next/navigation"

const SearchBox = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { countryCode } = useParams()

  const handleSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const { products } = await searchClientInstance.search<StoreProduct>(searchQuery, {
          limit: 5,
        }).then(res => ({
          products: res.hits,
          count: res.estimatedTotalHits || 0
        }))
        setResults(products)
      } catch (error) {
        console.error("Search failed:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    handleSearch(query)
  }, [query, handleSearch])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleViewAll = () => {
    router.push(`/${countryCode}/search?q=${encodeURIComponent(query)}`)
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search products..."
          className="w-full px-4 py-2 rounded-lg border border-[#6a5d76] focus:outline-none focus:border-[#f9b64b] bg-white text-[#6a5d76]"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#f9b64b] border-t-transparent"></div>
          </div>
        )}
      </div>

      {showResults && (query || results.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-[#6a5d76]/20">
          {results.length > 0 ? (
            <>
              <ul className="max-h-96 overflow-auto">
                {results.map((product) => (
                  <li key={product.id} className="border-b border-[#6a5d76]/10 last:border-b-0">
                    <LocalizedClientLink
                      href={`/products/${product.handle}`}
                      onClick={() => setShowResults(false)}
                      className="flex items-center p-4 hover:bg-[#f9b64b]/10 transition-colors"
                    >
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="ml-4">
                        <h4 className="text-[#6a5d76] font-medium">{product.title}</h4>
                        <p className="text-sm text-[#997a67] line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleViewAll}
                className="w-full p-3 text-center text-[#c99859] hover:text-[#f9b64b] transition-colors"
              >
                View all results
              </button>
            </>
          ) : query && !isLoading ? (
            <div className="p-4 text-center text-[#6a5d76]">
              No products found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBox 