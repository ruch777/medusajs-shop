"use client"

"use client"

import { useState, useEffect } from "react"
import { featuredSpices } from "@lib/data/spices"
import SpiceSliderItem from "./spice-slider-item"
import SpiceSliderControls from "./spice-slider-controls"
import ProductSearch from "@modules/common/components/product-search"
import { Button } from "@components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useMediaQuery from "@lib/hooks/use-media-query"

export default function SpiceSlider() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredSpices.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused])

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? featuredSpices.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) => 
      (prev + 1) % featuredSpices.length
    )
  }

  return (
    <section 
      className="relative w-full h-[400px] md:h-[600px] overflow-hidden"
      aria-label="Featured spices"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredSpices.map((spice, index) => (
          <SpiceSliderItem 
            key={spice.id}
            spice={spice}
            isActive={index === currentIndex}
          />
        ))}
      </div>
      
      {!isMobile && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md mt-20">
          <ProductSearch />
        </div>
      )}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="text-center">
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 transform -translate-y-1/2 left-4 rounded-full bg-white/50 hover:bg-white/75 backdrop-blur-sm"
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 transform -translate-y-1/2 right-4 rounded-full bg-white/50 hover:bg-white/75 backdrop-blur-sm"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: featuredSpices.length }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <SpiceSliderControls
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={currentIndex}
          totalItems={featuredSpices.length}
        />
      </div>
    </section>
  )
}