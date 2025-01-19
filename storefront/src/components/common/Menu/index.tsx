"use client"

import { useMenu } from "@lib/context/menu-context"
import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"

const Menu = () => {
  const { isOpen, closeMenu, toggleMenu } = useMenu()

  return (
    <>
      <button 
        type="button"
        onClick={toggleMenu}
        className="flex items-center gap-x-2 px-6 py-2 hover:bg-gray-100"
      >
        Menu
      </button>

      <Dialog open={isOpen} onClose={closeMenu}>
        <Transition show={isOpen}>
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl">
            <div className="flex justify-between p-4 border-b">
              <Dialog.Title>Menu</Dialog.Title>
              <button onClick={closeMenu}>
                <XMark />
              </button>
            </div>
          </Dialog.Panel>
        </Transition>
      </Dialog>
    </>
  )
}

export default Menu 