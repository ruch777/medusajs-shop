"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface MenuContext {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
}

const MenuContext = createContext<MenuContext | null>(null)

interface MenuProviderProps {
  children: React.ReactNode
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)

  // Load initial state from localStorage only on client side
  useEffect(() => {
    const savedState = localStorage.getItem("menuState")
    setIsOpen(savedState ? JSON.parse(savedState) : false)
  }, [])

  // Only save to localStorage if state is not null
  useEffect(() => {
    if (isOpen !== null) {
      localStorage.setItem("menuState", JSON.stringify(isOpen))
    }
  }, [isOpen])

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen(prev => prev === null ? true : !prev)

  // Don't render children until initial state is loaded
  if (isOpen === null) {
    return null // or a loading spinner if preferred
  }

  return (
    <MenuContext.Provider value={{ isOpen, openMenu, closeMenu, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (context === null) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}