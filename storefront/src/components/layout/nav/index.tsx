"use client"

import SideMenu from "@modules/layout/components/side-menu"
import Link from "next/link"
import CartButton from "@modules/layout/components/cart-button"

const Nav = () => {
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center h-full">
              <Link href="/" className="text-ui-fg-base">
                EPICEY
              </Link>
            </div>

            <div className="flex items-center gap-x-6">
              <SideMenu regions={null} />
              <CartButton />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Nav 