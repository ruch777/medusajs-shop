"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Suspense, useRef } from "react"
import { useScroll } from "@use-gesture/react"

interface CollectionGridProps {
  collections: HttpTypes.StoreCollection[]
}

const CollectionGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="aspect-[8/10] rounded-lg bg-gray-100 animate-pulse"
        />
      ))}
    </div>
  )
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections }) => {
  const ref = useRef<HTMLDivElement>(null)

  if (!collections?.length) {
    return null
  }

  const bindScroll = useScroll(({ delta: [dx] }) => {
    if (window.innerWidth < 768 && ref.current) {
      ref.current.scrollLeft += dx
    }
  })

  return (
    <div className="py-12 content-container">
      <Text className="mb-8 text-2xl-semi md:text-3xl-semi">Shop by Collection</Text>
      <Suspense fallback={<CollectionGridSkeleton />}>
        <div className="relative">
          <div 
            ref={ref} 
            {...bindScroll()} 
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible"
          >
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative aspect-[8/10] min-w-[80vw] md:min-w-0 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-transform"
                role="article"
                aria-label={`${collection.title} collection`}
              >
                <LocalizedClientLink
                  href={`/collections/${collection.handle}`}
                  className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-xl"
                  aria-label={`View ${collection.title} collection`}
                >
                  {collection.metadata?.thumbnail ? (
                    <Image
                      src={collection.metadata.thumbnail as string}
                      alt={`${collection.title} collection thumbnail`}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      width={600}
                      height={750}
                      priority={collections.indexOf(collection) === 0}
                      quality={90}
                      loading={collections.indexOf(collection) === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Text className="text-gray-400">No image available</Text>
                    </div>
                  )}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Text className="text-xl-semi text-white drop-shadow-lg">
                      {collection.title}
                    </Text>
                    {typeof collection.metadata?.description === 'string' && (
                      <Text className="mt-1 text-white text-small-regular line-clamp-2 opacity-90">
                        {collection.metadata.description}
                      </Text>
                    )}
                  </div>
                </LocalizedClientLink>
              </motion.div>
            ))}
          </div>
        </div>
      </Suspense>
    </div>
  )
}

export default CollectionGrid 