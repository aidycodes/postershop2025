"use client"

import Link from "next/link"
import { User } from "lucide-react"
import SignedInUser from "./signed-in-user"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import type { CurrentUser } from "../navbar"
import type { UserSession } from "@/app/layout"

interface NavUserProps {

    currentUser: CurrentUser | null;
    session: UserSession | null | undefined
}

const NavUser = ({ currentUser,  session }: NavUserProps) => {
    console.log(currentUser, 'currentUser')
    const { data: userData } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await client.users.me.$get()
            return res.json()
        },
        initialData: {
            id: session?.id || "",
            name: session?.name || "",
            email: currentUser?.user?.email || "",
            image: currentUser?.user?.image || "",
            createdAt: currentUser?.user?.createdAt || "",
            updatedAt: currentUser?.user?.updatedAt || "",
            emailVerified: currentUser?.user?.emailVerified || false, 
            phone: currentUser?.user?.phone || "",
            city: currentUser?.user?.city || "",
            country: currentUser?.user?.country || "",
            postal_code: currentUser?.user?.postal_code || "",
            address: currentUser?.user?.address || "",
        }
    });

    return (
        <div>            
            {!!userData?.id ? (       
                <SignedInUser name={userData?.name || ""} />
            ) : (
                <Link href="/sign-in">
                    <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                        <User className="h-6 w-6" />
                        <span>Sign in</span>
                    </div>
                </Link>
            )}
        </div>
    );
}

export default NavUser
