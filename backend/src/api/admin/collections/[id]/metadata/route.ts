import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ModuleRegistrationName } from "@medusajs/utils"
import type { 
  FindConfig,
  ProductCollectionDTO,
  UpdateProductCollectionDTO,
} from "@medusajs/types"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const metadata = req.body as Record<string, unknown>

  try {
    const productService = req.scope.resolve(ModuleRegistrationName.PRODUCT)
    const collection = await productService.updateProductCollections(id, {
      metadata
    })

    res.json({ collection })
  } catch (error) {
    console.error("Error updating collection metadata:", error)
    res.status(400).json({
      message: "Failed to update collection metadata",
      error: error.message,
    })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params

  try {
    const productService = req.scope.resolve(ModuleRegistrationName.PRODUCT)
    const collection = await productService.retrieveProductCollection(id)

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found"
      })
    }

    res.json({ collection })
  } catch (error) {
    console.error("Error retrieving collection:", error)
    res.status(400).json({
      message: "Failed to retrieve collection",
      error: error.message,
    })
  }
} 