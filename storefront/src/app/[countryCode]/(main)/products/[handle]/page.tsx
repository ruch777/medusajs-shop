import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import { getProductByHandle } from "@lib/data/products"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
  }
}

export default async function ProductPage({ params }: Props) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const { product } = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return (
    <ProductTemplate 
      product={product} 
      region={region}
      countryCode={params.countryCode}
    />
  )
}
