"use client"

import Link, { LinkProps } from "next/link"
import { useParams } from "next/navigation"
import React from "react"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
type LocalizedClientLinkProps = Omit<LinkProps, "href"> & {
  children?: React.ReactNode
  className?: string
  "data-testid"?: string
  onClick?: () => void
  href: string
}

const LocalizedClientLink = ({
  children,
  href,
  ...props
}: LocalizedClientLinkProps) => {
  const { countryCode } = useParams()

  return (
    <Link href={`/${countryCode}${href}`} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
