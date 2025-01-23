"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Suspense } from "react"

interface CollectionGridProps {
  collections: HttpTypes.StoreCollection[]
}

const CollectionGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
  if (!collections?.length) {
    return null
  }

  return (
    <div className="py-12 content-container">
      <Text className="mb-8 text-2xl-semi">Shop by Collection</Text>
      <Suspense fallback={<CollectionGridSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-[8/10] overflow-hidden rounded-lg bg-gray-100"
              role="article"
              aria-label={`${collection.title} collection`}
            >
              <LocalizedClientLink
                href={`/collections/${collection.handle}`}
                className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                aria-label={`View ${collection.title} collection`}
              >
                {collection.metadata?.thumbnail ? (
                  <Image
                    src={collection.metadata.thumbnail as string}
                    alt={`${collection.title} collection thumbnail`}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    width={400}
                    height={500}
                    quality={90}
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <Text className="text-gray-400">No image available</Text>
                  </div>
                )}
                <div 
                  className="absolute inset-0 bg-black bg-opacity-20 transition-opacity group-hover:bg-opacity-30"
                  aria-hidden="true"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <Text className="text-xl-semi text-white drop-shadow-md">
                    {collection.title}
                  </Text>
                  {typeof collection.metadata?.description === 'string' && (
                    <Text className="mt-2 text-white text-small-regular line-clamp-2 drop-shadow-md">
                      {collection.metadata.description}
                    </Text>
                  )}
                </div>
              </LocalizedClientLink>
            </motion.div>
          ))}
        </div>
      </Suspense>
    </div>
  )
}

export default CollectionGrid 