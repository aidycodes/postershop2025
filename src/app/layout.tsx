import type { Metadata } from "next"
import { Providers } from "./components/providers"
import Footer from "@/components/footer/footer"
import PromotionBanner from "@/components/navigation/promotion-banner"
import Navbar from "@/components/navigation/navbar"
import type { Category } from "@/components/categorys/categorys"
import { client } from "@/lib/client"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

import "./globals.css"

export const metadata: Metadata = {
  title: "Poster Hub",
  description: "Poster Hub is a platform for buying posters",
  icons: [{ rel: "icon", url: "/favicon.webp" }],
}



export interface UserSession {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()

  const categories = await client.products.getCategorys.$get()
  const categoriesData: {data: Category[]} = await categories.json() 
  const session = await auth.api.getSession({
    headers: headersList
  })
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers> 
          <PromotionBanner promotion="Save now up to 20% off for new customers with code: " showPromotion={true} code="NEW20" />
          <Navbar categories={categoriesData.data} session={session?.user as UserSession | null} />
            {children}
          <Footer blurb="Curating beautiful posters for your space since 2024."
          storeName="Poster Shop" infoPages={["Shipping", "Returns", "FAQ", "Contact Us"]} />
          
        </Providers>
      </body>
    </html>

  )
}
