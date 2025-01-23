"use client"

import { Text, Button, Input } from "@medusajs/ui"
import { useState } from "react"

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    
    // TODO: Integrate with your newsletter service
    // For now, just simulate success
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1000)
  }

  return (
    <div className="py-12 content-container">
      <div className="max-w-2xl mx-auto text-center">
        <Text className="text-2xl-semi mb-4">Subscribe to our updates</Text>
        <Text className="text-base-regular text-gray-600 mb-8">
          Stay informed about new products, special offers, and the latest spice recipes.
        </Text>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="min-w-[300px]"
            required
            aria-label="Email subscription"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={status === "loading"}
            className="w-full sm:w-auto"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        {status === "success" && (
          <Text className="text-green-600 mt-4">
            Thanks for subscribing! We'll be in touch soon.
          </Text>
        )}
        {status === "error" && (
          <Text className="text-red-600 mt-4">
            Something went wrong. Please try again.
          </Text>
        )}
      </div>
    </div>
  )
}

export default Newsletter 