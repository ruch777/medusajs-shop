"use client"

import Link, { LinkProps } from 'next/link'
import React from 'react'
import { useParams } from "next/navigation"
import { PropsWithChildren } from "react"

interface LocalizedClientLinkProps extends LinkProps, PropsWithChildren {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  className?: string
}

const LocalizedClientLink: React.FC<LocalizedClientLinkProps> = ({ children, onClick, ...props }) => {
  const { countryCode } = useParams()

  const localizedHref = `/${countryCode}${props.href}`

  return (
    <Link {...props} href={localizedHref}>
      <span onClick={onClick} className={props.className} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </Link>
  )
}

export default LocalizedClientLink