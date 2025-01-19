"use client"

import React from "react"
import { useMenu } from "@lib/context/menu-context"

const Menu = () => {
  const { toggleMenu } = useMenu()

  return (
    <button 
      onClick={toggleMenu}
      className="flex items-center p-2 rounded-md hover:bg-gray-100"
      aria-label="Menu"
    >
      <span className="text-red-600">Menu</span>
    </button>
  )
}

export default Menu 