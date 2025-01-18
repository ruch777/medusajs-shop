"use client"

import SpiceSlider from "../spice-slider"
import ProductSearch from "@modules/common/components/product-search"

const MobileHero = () => {
  return (
    <div className="relative w-full">
      <div className="fixed top-0 left-0 w-full z-10 bg-white p-4 pb-32">
        <ProductSearch />
      </div>
      <div className="mt-20">
        <SpiceSlider />
      </div>
    </div>
  )
}

export default MobileHero