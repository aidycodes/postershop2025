"use client"
import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { User } from "lucide-react"

const SignedInUser = ({name}: {name: string}) => {
    const {data: user} = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
          const res = await client.users.me.$get()
          return res.json()
        }
      })
      return (
       <Link href="/dashboard/user">
            <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                <User className="h-6 w-6" />
                    <span>{name ? name?.charAt(0).toUpperCase() + name?.slice(1) : 'User'}</span>
            </div>
        </Link>
      )
}

export default SignedInUser
