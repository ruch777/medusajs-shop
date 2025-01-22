"use client"

import { getSDK } from "@lib/config"
import { useQuery } from "@tanstack/react-query"
import React, { createContext, useCallback, useContext, useEffect } from "react"
import type { HttpTypes } from "@medusajs/types"
import { medusaClient } from "@lib/config"

type Cart = HttpTypes.StoreCart

interface CartContext {
  cart?: Cart | null
  isLoading: boolean
  setCart: (cart: Cart) => void
  resetCart: () => void
  addItem: (variantId: string, quantity: number) => Promise<void>
}

const CartContext = createContext<CartContext | null>(null)

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { 
    data: cart, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const storedCartId = localStorage.getItem("cart_id")
      if (!storedCartId) return null

      const sdk = await getSDK()
      const { cart } = await sdk.carts.retrieve(storedCartId)
      return cart
    }
  })

  const setCart = useCallback((cart: Cart) => {
    localStorage.setItem("cart_id", cart.id)
    refetch()
  }, [refetch])

  const resetCart = useCallback(() => {
    localStorage.removeItem("cart_id")
    refetch()
  }, [refetch])

  const addItem = useCallback(async (variantId: string, quantity: number) => {
    const cartId = localStorage.getItem("cart_id")
    if (!cartId) return

    const sdk = await getSDK()
    const { cart } = await sdk.carts.createLineItem(cartId, {
      variant_id: variantId,
      quantity
    })
    setCart(cart)
  }, [setCart])

  const createCart = async () => {
    const sdk = await getSDK()
    const { cart } = await sdk.carts.create({})
    setCart(cart)
    localStorage.setItem("cart_id", cart.id)
    return cart
  }

  const getCart = async () => {
    const storedCartId = localStorage.getItem("cart_id")
    if (!storedCartId) {
      return null
    }

    const sdk = await getSDK()
    const { cart } = await sdk.carts.retrieve(storedCartId)
    setCart(cart)
    return cart
  }

  useEffect(() => {
    const createNewCart = async () => {
      const sdk = await getSDK()
      const { cart } = await sdk.carts.create({})
      setCart(cart)
    }

    if (!localStorage.getItem("cart_id")) {
      createNewCart()
    }
  }, [setCart])

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        setCart,
        resetCart,
        addItem
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 