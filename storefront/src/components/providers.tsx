"use client"

import { useState } from "react"
import { MenuProvider } from "@lib/context/menu-context"
import { ModalProvider } from "@lib/context/modal-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <MenuProvider>
      <ModalProvider close={() => setIsModalOpen(false)}>
        {children}
      </ModalProvider>
    </MenuProvider>
  )
}