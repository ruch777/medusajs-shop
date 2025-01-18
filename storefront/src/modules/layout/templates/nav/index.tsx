"use client"
import { Suspense, useState } from "react"
import { Menu } from "lucide-react"
import CurrencyModal from "@modules/layout/components/currency-modal"

import { listRegions } from "@lib/data/regions"
import { getCollectionsList } from "@lib/data/collections"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Image from "next/image"

interface Collection {
  id: string
  handle: string
  title: string
}

async function TopNav() {
  let collections: Collection[] = []
  try {
    const result = await getCollectionsList()
    if (result?.collections) {
      collections = result.collections.map(col => ({
        id: col.id,
        handle: col.handle,
        title: col.title
      }))
      console.log('Fetched collections:', collections)
    }
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return null
  }

  if (!collections.length) {
    return null
  }

  return (
    <div className="bg-brand-primary">
      <div className="content-container mx-auto">
        <nav className="hidden md:flex items-center justify-between text-sm text-white">
          <div className="flex items-center gap-6">
            {collections.map((collection) => (
              <LocalizedClientLink
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="hover:text-brand-secondary transition-colors py-3"
              >
                {collection.title}
              </LocalizedClientLink>
            ))}
          </div>
        </nav>
        
        <div className="md:hidden flex items-center justify-between p-3">
          <button className="text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default async function Nav() {
  let regions: StoreRegion[] = []
  let error = false
  
  try {
    regions = await listRegions()
  } catch (err) {
    console.error("Failed to fetch regions:", err)
    error = true
  }
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  return (
    <div className="z-50 group">
      <TopNav />
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center gap-4">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
            {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
              <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <LocalizedClientLink
                  className="hover:text-ui-fg-base text-sm"
                  href="/search"
                  scroll={false}
                  data-testid="nav-search-link"
                >
                  Search
                </LocalizedClientLink>
              </div>
            )}
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="h-full flex items-center"
              data-testid="nav-store-link"
            >
              <Image
                src="/images/logo.png"
                alt="Spice Store"
                priority
                layout="fill"
                style={{ objectFit: 'contain' }}
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <div className="relative">
                <button onClick={() => setIsCurrencyModalOpen(true)} className="flex items-center gap-1 hover:text-ui-fg-base">
                  <span>USD</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <LocalizedClientLink
                className="flex items-center gap-1 hover:text-ui-fg-base"
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
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="w-6 h-6 bg-ui-bg-subtle rounded-full" />
                  <span className="w-10 h-4 bg-ui-bg-subtle rounded" />
                </div>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
      <CurrencyModal isOpen={isCurrencyModalOpen} onClose={() => setIsCurrencyModalOpen(false)} />
    </div>
  )
}
