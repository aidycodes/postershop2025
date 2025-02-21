"use client"

import Link from "next/link"
import { User } from "lucide-react"
import SignedInUser from "./signed-in-user"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
const NavUser = ({isSignedIn, name}: {isSignedIn: boolean, name?: string}) => {

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await client.users.me.$get()
            return res.json()
        }
    })

    
    return (
        <div>            
            {!!user?.id ? (       
            <SignedInUser name={user.name || ""} />
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
