import { XMarkMini } from "@medusajs/icons"
import { FormEvent } from "react"
import { useRouter } from "next/navigation"

import SearchBoxWrapper, {
  ControlledSearchBoxProps,
} from "../search-box-wrapper"

interface SearchBoxProps {
  onSearch?: (query: string) => void
}

const ControlledSearchBox = ({
  inputRef,
  onChange,
  onReset,
  onSubmit,
  placeholder,
  value,
}: ControlledSearchBoxProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (onSubmit) {
      onSubmit(event)
    }
  }

  const handleReset = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()

    onReset(event)
  }

  return (
    <form
      action=""
      noValidate
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="w-full"
    >
      <div className="flex items-center justify-between w-full">
        <input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={placeholder}
          spellCheck={false}
          type="search"
          value={value}
          onChange={onChange}
          className="text-base-regular w-full bg-transparent focus:outline-none placeholder:text-ui-fg-on-color"
          data-testid="search-input"
        />
        {value && (
          <button
            onClick={handleReset}
            type="button"
            className="h-5 w-5 flex items-center justify-center"
          >
            <XMarkMini />
          </button>
        )}
      </div>
    </form>
  )
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const router = useRouter()

  return (
    <SearchBoxWrapper
      onSubmit={(e) => {
        const target = e.target as HTMLFormElement
        const input = target.querySelector('input[type="search"]') as HTMLInputElement
        if (input?.value && onSearch) {
          onSearch(input.value)
        }
      }}
    >
      {(props) => {
        return (
          <>
            <ControlledSearchBox {...props} />
          </>
        )
      }}
    </SearchBoxWrapper>
  )
}

export default SearchBox
