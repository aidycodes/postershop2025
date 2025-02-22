import type { Metadata } from "next"
import { Providers } from "./components/providers"
import Footer from "@/components/footer/footer"
import PromotionBanner from "@/components/navigation/promotion-banner"
import Navbar from "@/components/navigation/navbar"
import type { Category } from "@/components/categorys/categorys"
import { client } from "@/lib/client"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { User } from "@/app/dashboard/user/user-form"
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
const queryClient = new QueryClient()
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const categories = await client.products.getCategorys.$get()
  const categoriesData: {data: Category[]} = await categories.json() 
  const session = await auth.api.getSession({
    headers: await headers()
  })


 
  await queryClient.prefetchQuery({
    queryKey: ['cart'],
    queryFn: async() => fetch(`${process.env.NEXT_PUBLIC_APP_URL}api/v1/events/cart`, {
      headers: await headers()
    }).then(res => res.json())
  })

  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: async() => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}api/v1/events/user`, {
      headers: await headers()
    })
    const user: {user: User} = await res.json()
    if(user){
    return user.user
    }
    {
      return {
        name: "",
        email: "",
        phone: "",
        city: "",
        country: "",
        postal_code: "",
        address: "",
      }
    }
  }
  })
  

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">

        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
          <PromotionBanner promotion="Save now up to 20% off for new customers with code: " showPromotion={true} code="NEW20" />
          <Navbar categories={categoriesData.data} session={session?.user as UserSession | null} />
            {children}
          <Footer blurb="Curating beautiful posters for your space since 2024."
          storeName="Poster Shop" infoPages={["Shipping", "Returns", "FAQ", "Contact Us"]} />
          </HydrationBoundary>
        </Providers>
      </body>
    </html>

  )
}
