import { Suspense } from "react"
import { Menu } from "lucide-react"

import { listRegions } from "@lib/data/regions"
import { getCollectionsList } from "@lib/data/collections"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchBox from "@modules/common/components/search-box"
import Image from "next/image"

interface Collection {
  id: string
  handle: string
  title: string
}

const TopNav = async () => {
  let collections: Collection[] = []
  try {
    const result = await getCollectionsList()
    if (result?.collections) {
      collections = result.collections.map((col: { id: string; handle: string; title: string }) => ({
        id: col.id,
        handle: col.handle,
        title: col.title
      }))
    }
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return null
  }

  if (!collections.length) {
    return null
  }

  return (
    <div className="bg-[#955220]">
      <div className="content-container mx-auto">
        <nav className="hidden md:flex items-center justify-between text-sm text-white">
          <div className="flex items-center gap-6">
            {collections.map((collection) => (
              <LocalizedClientLink
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="hover:text-[#f9b64b] transition-colors py-3"
              >
                {collection.title}
              </LocalizedClientLink>
            ))}
          </div>
        </nav>
        
        <div className="md:hidden flex items-center justify-between p-3">
          <button className="text-white hover:text-[#f9b64b]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

const RegionsLoader = async () => {
  try {
    const regions = await listRegions()
    return <SideMenu regions={regions} />
  } catch (err) {
    console.error("Failed to fetch regions:", err)
    return <SideMenu regions={[]} />
  }
}

export default function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 px-8 mx-auto border-b duration-200 bg-white border-[#c99859]/10">
        <nav className="txt-xsmall-plus text-[#c99859] flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <Suspense fallback={<div className="h-full" />}>
                {/* @ts-expect-error Server Component */}
                <RegionsLoader />
              </Suspense>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full ml-6">
              <SearchBox />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-[#f9b64b] uppercase"
              data-testid="nav-store-link"
            >
              <Image
                src="/images/logo.png"
                alt="Spice Store"
                width={120}
                height={40}
                priority
                className="h-auto"
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-[#f9b64b] text-[#c99859]">
                  <span>USD</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block bg-white border border-[#c99859]/10 rounded shadow-lg mt-1 p-2 min-w-[120px]">
                  <button className="block w-full text-left px-2 py-1 hover:bg-[#f9b64b]/10 text-[#c99859] rounded">USD</button>
                  <button className="block w-full text-left px-2 py-1 hover:bg-[#f9b64b]/10 text-[#c99859] rounded">EUR</button>
                  <button className="block w-full text-left px-2 py-1 hover:bg-[#f9b64b]/10 text-[#c99859] rounded">GBP</button>
                </div>
              </div>
              <LocalizedClientLink
                className="hover:text-[#f9b64b] flex items-center gap-2 text-[#c99859]"
                href="/account"
                data-testid="nav-account-link"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3333 14V12.6667C13.3333 11.9594 13.0523 11.2811 12.5522 10.781C12.0521 10.281 11.3739 10 10.6666 10H5.33329C4.62605 10 3.94777 10.281 3.44767 10.781C2.94758 11.2811 2.66663 11.9594 2.66663 12.6667V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.00004 7.33333C9.4728 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.4728 2 8.00004 2C6.52728 2 5.33337 3.19391 5.33337 4.66667C5.33337 6.13943 6.52728 7.33333 8.00004 7.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-[#f9b64b] flex gap-2 text-[#c99859]"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              {/* @ts-expect-error Server Component */}
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
      <Suspense fallback={null}>
        {/* @ts-expect-error Server Component */}
        <TopNav />
      </Suspense>
    </div>
  )
}
