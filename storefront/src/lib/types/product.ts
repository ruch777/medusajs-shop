import {
  ProductDTO,
  ProductVariantDTO,
} from "@medusajs/types/dist/product/common"
import { MoneyAmountDTO } from "@medusajs/types/dist/pricing/common/money-amount"

export type Product = Omit<ProductDTO, "variants" | "options" | "images" | "collection" | "product_type" | "product_tags" | "discount_rules"> & {
  variants: ProductVariant[]
}

export type ProductVariant = Omit<ProductVariantDTO, "prices" | "options"> & {
  prices: MoneyAmountDTO[]
}

export type ProductPreviewType = Omit<
  ProductDTO,
  "variants" | "options" | "images" | "collection" | "product_type" | "product_tags" | "discount_rules" | "description"
>

export type ProductListType = {
  products: ProductPreviewType[]
  count: number
  facets: any[]
}

export type ProductType = Omit<ProductDTO, "variants" | "options" | "images" | "collection" | "product_type" | "product_tags" | "discount_rules"> & {
  variants: ProductVariant[]
  description: string
}