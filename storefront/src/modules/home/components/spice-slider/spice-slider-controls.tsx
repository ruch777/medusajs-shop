"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@components/ui/button"

interface SpiceSliderControlsProps {
  onPrev: () => void
  onNext: () => void
  currentIndex: number
  totalItems: number
}

export default function SpiceSliderControls({
  onPrev,
  onNext,
  currentIndex,
  totalItems
}: SpiceSliderControlsProps) {
  return null
}