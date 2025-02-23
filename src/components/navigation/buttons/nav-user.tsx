"use client"

import Link from "next/link"
import { User } from "lucide-react"
import SignedInUser from "./signed-in-user"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import type { UserSession } from "@/app/layout"
import type { UserDetails } from "@/components/navigation/navbar"

const NavUser = ({isSignedIn, userData, session}: {isSignedIn: boolean, userData?: UserDetails | null, session?: UserSession | null}) => {

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await client.users.me.$get()
            return res.json()
        },
        initialData: {
            id: session?.id || "",
            name: session?.name || "",
            email: session?.email || "",
            emailVerified: session?.emailVerified || false,
            image: session?.image || "",
            phone: userData?.user?.phone || "",
            city: userData?.user?.city || "",
            country: userData?.user?.country || "",
            postal_code: userData?.user?.postal_code || "",
            address: userData?.user?.address || "",
            createdAt: userData?.user?.createdAt || "",
            updatedAt: userData?.user?.updatedAt || ""
        }
    })

    
    return (
        <div>            
            {!!user?.id ? (       
            <SignedInUser name={user.name || "User"} />
                ) : (
                <Link href="/sign-in">
                    <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                        <User className="h-6 w-6" />
                        <span>Sign in</span>
                    </div>
                </Link>
                )}
            </div>
    )
}

export default NavUser
