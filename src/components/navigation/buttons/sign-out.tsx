'use client'
import { authClient } from "@/lib/auth-client"
import { LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { useTransition, useState } from "react"

const SignOut = () => {
    
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

    const {data: user} = useQuery({
      queryKey: ["user"],
      queryFn: async () => {
        const res = await client.users.me.$get()
        return res.json()
      }
    })
      
    const signOut = async () => {
      setIsLoading(true)
      startTransition(async () => {
          await authClient.signOut()
          queryClient.setQueryData(['user'] , null)
          setIsLoading(false)
          router.push('/')
      })
  }

    if(!user) return null

 return(
    <button disabled={isLoading} aria-label="Sign Out" title="Sign Out" className="p-2 group cursor-pointer rounded-full hover:bg-gray-100" onClick={() => signOut()}>
    {!!isPending ? <Loader2 size={16} className="animate-spin text-green-500" /> : <LogOut size={16} className="h-4 w-4 text-gray-500 group-hover:text-red-500" />}
  </button>
)
}

export default SignOut
