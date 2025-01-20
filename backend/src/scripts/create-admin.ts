import { ExecArgs } from "@medusajs/types"
import { IUserModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createAdmin({
  container,
}: ExecArgs) {
  const userModuleService: IUserModuleService = container.resolve(Modules.USER)
  
  try {
    const user = await userModuleService.createUsers({
      email: "admin@medusa.com",
      password: "supersecret",
      role: "admin",
    })

    console.log("Created admin user:", user.email)
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
} 