import { ExecArgs } from "@medusajs/types"
import { IApiKeyModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createPublishableKey({
  container,
}: ExecArgs) {
  const apiKeyModuleService: IApiKeyModuleService = container.resolve(Modules.API_KEY)
  
  try {
    const apiKey = await apiKeyModuleService.create({
      title: "Webshop",
      type: "publishable",
    })

    console.log("Created publishable API key:", apiKey.token)
  } catch (error) {
    console.error("Error creating publishable API key:", error)
  }
} 