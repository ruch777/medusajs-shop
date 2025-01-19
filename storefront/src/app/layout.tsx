import { MenuProvider } from "@lib/context/menu-context"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import "styles/globals.css"
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import ClientLayout from "./client-layout"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={inter.variable}>
        <MenuProvider>
          <main className="relative">
            <ClientLayout>
              {props.children}
            </ClientLayout>
          </main>
          <Toaster />
        </MenuProvider>
      </body>
    </html>
  )
}
