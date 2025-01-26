"use client"

import { InstantSearch } from "react-instantsearch-hooks-web"
import { useRouter } from "next/navigation"
import { MagnifyingGlassMini } from "@medusajs/icons"
import { Container, Text } from "@medusajs/ui"
import { useEffect, useRef, useState } from "react"

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import Hit from "@modules/search/components/hit"
import Hits from "@modules/search/components/hits"
import SearchBox from "@modules/search/components/search-box"

type SearchCategory = "all" | "products" | "collections" | "categories"

const SearchModal = () => {
  const router = useRouter()
  const searchRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>("all")
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const categories: { id: SearchCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "products", label: "Products" },
    { id: "collections", label: "Collections" },
    { id: "categories", label: "Categories" }
  ]

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const addToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  // close modal on outside click
  const handleOutsideClick = (event: MouseEvent) => {
    if (event.target === searchRef.current) {
      router.back()
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick)
    return () => {
      window.removeEventListener("click", handleOutsideClick)
    }
  }, [])

  // disable scroll on body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // on escape key press, close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  const searchParams = {
    query: searchTerm,
    filter: selectedCategory !== "all" ? [`category_names = "${selectedCategory}"`] : undefined,
    limit: 10
  }

  return (
    <div className="relative z-50">
      <div className="fixed inset-0 bg-opacity-75 backdrop-blur-md opacity-100 h-screen w-screen" />
      <div className="fixed inset-0 px-5 sm:p-0" ref={searchRef}>
        <div className="flex flex-col justify-start w-full h-fit transform p-5 items-center text-left align-middle transition-all max-h-[75vh] bg-transparent shadow-none">
          <InstantSearch
            indexName={SEARCH_INDEX_NAME}
            searchClient={searchClient}
          >
            <div
              className="flex flex-col h-fit w-full sm:w-[600px]"
              data-testid="search-modal-container"
            >
              <div className="w-full flex flex-col gap-4 p-4 bg-[rgba(3,7,18,0.5)] text-ui-fg-on-color backdrop-blur-2xl rounded-lg">
                {/* Search Input */}
                <div className="flex items-center gap-x-2">
                  <MagnifyingGlassMini />
                  <SearchBox onSearch={addToRecentSearches} />
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 pt-2 border-t border-gray-600">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategory === category.id
                          ? "bg-white text-black"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <Text className="text-ui-fg-subtle mb-2">Recent Searches</Text>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          router.push(`/results/${search}`)
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="flex-1 mt-4">
                <Container className="bg-white rounded-lg">
                  <Hits hitComponent={Hit} category={selectedCategory} />
                </Container>
              </div>
            </div>
          </InstantSearch>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
