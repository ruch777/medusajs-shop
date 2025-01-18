"use client"

import SpiceSlider from "../spice-slider"
import MobileHero from "../mobile-hero"
import useMediaQuery from "@lib/hooks/use-media-query"

const Hero = () => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="relative w-full">
      {isMobile ? <MobileHero /> : <SpiceSlider />}
    </div>
  )
}

export default Hero
