export interface Product {
  id: string
  title: string
  handle: string
  thumbnail: string
}

export interface ProductType {
  id: string
  title: string
  handle: string
  thumbnail: string
  description: string
  price: number
  variants: ProductVariant[]
  products?: ProductPreviewType[]
}

export interface ProductPreviewType {
  id: string
  title: string
  handle: string
  thumbnail: string
  price: number
  collection_id?: string
  products?: ProductPreviewType[]
}

export interface ProductListType {
  products: ProductPreviewType[]
  count: number
}

export interface ProductVariant {
  id: string
  title: string
  price: number
}