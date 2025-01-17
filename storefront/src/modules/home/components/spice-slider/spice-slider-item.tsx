"use client"

import { Spice } from "@lib/data/products"
import Image from "next/image"
import { Button } from "@components/ui/button"

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
        <div className="flex flex-col items-center justify-center h-full mt-16 pb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
            {spice.name}
          </h2>
          <p className="text-lg md:text-xl text-white max-w-[600px] text-center mb-4">
            {spice.description}
          </p>
          <p className="text-lg md:text-xl text-white max-w-[600px] text-center mb-8">
            Authentic Ceylon Spices
          </p>
          <Button variant="default" size="lg" className="bg-brand-secondary text-brand-primary">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  )
}