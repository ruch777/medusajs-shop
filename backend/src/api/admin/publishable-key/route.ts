import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { IApiKeyModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const apiKeyModuleService: IApiKeyModuleService = req.scope.resolve(Modules.API_KEY)
    const apiKey = await apiKeyModuleService.createKey({
      title: "Webshop",
      type: "publishable",
    })

    res.json({ publishableApiKey: apiKey.token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
} 