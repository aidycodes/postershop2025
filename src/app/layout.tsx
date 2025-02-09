import type { Metadata } from "next"
import { Providers } from "./components/providers"
import Footer from "@/components/footer/footer"
import PromotionBanner from "@/components/navigation/promotion-banner"
import Navbar from "@/components/navigation/navbar"

import "./globals.css"

export const metadata: Metadata = {
  title: "JStack App",
  description: "Created using JStack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">

        <Providers>
          <PromotionBanner promotion="Save now up to 20% off for new customers with code: " showPromotion={true} code="NEW20" />
          <Navbar />
            {children}
          <Footer blurb="Curating beautiful posters for your space since 2024."
          storeName="Poster Shop" infoPages={["Shipping", "Returns", "FAQ", "Contact Us"]} />
        </Providers>
      </body>
    </html>

  )
}
