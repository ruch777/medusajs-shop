"use client"

import { MagnifyingGlassMini } from "@medusajs/icons"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import SearchBoxWrapper from "../search-box-wrapper"

type SearchBoxProps = {
  onSearch?: (query: string) => void
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const input = target.querySelector('input[type="search"]') as HTMLInputElement
    if (input?.value) {
      if (onSearch) {
        onSearch(input.value)
      } else {
        router.push(`/results/${input.value}`)
      }
    }
  }

  return (
    <SearchBoxWrapper>
      {({ value, onChange, onReset, placeholder }) => (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center justify-between">
            <input
              type="search"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="txt-compact-large bg-transparent flex-1 px-4"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              maxLength={64}
              role="searchbox"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="focus:outline-none"
              aria-label="Submit search"
            >
              <MagnifyingGlassMini />
            </button>
          </div>
        </form>
      )}
    </SearchBoxWrapper>
  )
}

export default SearchBox
