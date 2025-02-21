'use client'
import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"

const SignOut = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const signOut = async() => {
        await authClient.signOut()
        queryClient.invalidateQueries({queryKey: ["user"]})
        router.refresh()
    }
    const {data: user} = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await client.users.me.$get()
            return res.json()
        }
    })

    if(!user) return null

 return(
    <button aria-label="Sign Out" title="Sign Out" className="p-2 group cursor-pointer rounded-full hover:bg-gray-100" onClick={() => signOut()}>
    <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
  </button>
)
}

export default SignOut
