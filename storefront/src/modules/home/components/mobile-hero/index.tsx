"use client"

import SpiceSlider from "../spice-slider"
import ProductSearch from "@modules/common/components/product-search"

const MobileHero = () => {
  return (
    <>
      <div className="relative w-full">
        <div className="absolute top-0 left-0 w-full z-10 bg-white p-4 pb-4 transition-all duration-300">
          <div className="w-full flex justify-center">
            <ProductSearch />
          </div>
        </div>
        <div className="mt-20">
          <SpiceSlider />
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-hero > div:first-child {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            max-width: 768px;
          }
        }
      `}</style>
    </>
  )
}

export default MobileHero