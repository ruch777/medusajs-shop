"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { PropsWithChildren } from "react"

type LocalizedClientLinkProps = {
  href: string
  className?: string
  scroll?: boolean
  "data-testid"?: string
} & PropsWithChildren

export default function LocalizedClientLink({
  href,
  className,
  scroll = true,
  children,
  ...props
}: LocalizedClientLinkProps) {
  const { countryCode } = useParams()

  const localizedHref = `/${countryCode}${href}`

  return (
    <Link
      href={localizedHref}
      className={className}
      scroll={scroll}
      {...props}
    >
      {children}
    </Link>
  )
}