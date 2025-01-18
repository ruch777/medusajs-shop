"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@components/ui/button"
import { useSearch } from "@lib/hooks/use-search"
import { Product } from "@lib/types/product"

interface ProductSearchProps {
  onSelect?: (product: Product) => void
}

export default function ProductSearch({ onSelect }: ProductSearchProps) {
  const [query, setQuery] = useState("")
  const { products, isLoading } = useSearch(query)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSelect = (product: Product) => {
    setQuery("")
    onSelect?.(product)
  }

  return (
    <div className="relative mt-8 w-full">
      <div className="flex items-center border w-full">
        <input
          type="text"
          placeholder="Search spices"
          className="px-4 py-2 w-full focus:outline-none"
          value={query}
          onChange={handleSearch}
        />
        <Button variant="secondary" size="sm" className="ml-auto">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
      {query && products && products.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-md mt-1 z-10">
          {isLoading ? (
            <div className="p-4">Loading...</div>
          ) : (
            products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(product)}
              >
                {product.title}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}