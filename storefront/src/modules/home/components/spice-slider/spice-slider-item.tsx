"use client"

import { Spice } from "@lib/data/products"
import Image from "next/image"
import { Button } from "@components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface SpiceSliderItemProps {
  spice: Spice
  isActive: boolean
}

export default function SpiceSliderItem({ spice, isActive }: SpiceSliderItemProps) {
  return (
    <div 
      className={`w-full h-[400px] md:h-[600px] flex-shrink-0 relative transition-opacity duration-500 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src={spice.image}
        alt={spice.name}
        fill
        className="object-cover"
        priority={isActive}
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8">
        <div className="flex flex-col items-center justify-center h-full mt-16 pb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
            {spice.name}
          </h2>
          <p className="text-lg md:text-xl text-white text-center mb-4 whitespace-normal">
            {spice.description}
          </p>
          <p className="text-lg md:text-xl text-white text-center mb-8 whitespace-normal">
            Authentic Ceylon Spices
          </p>
          <LocalizedClientLink href="/store">
            <Button variant="default" size="lg" className="bg-brand-secondary text-brand-primary mt-8">
              Shop Now
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}