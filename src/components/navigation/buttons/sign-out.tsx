'use client'
import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

const SignOut = () => {
    const router = useRouter()
    const signOut = async() => {
        await authClient.signOut()
        router.refresh()
    }

 return(
    <button aria-label="Sign Out" title="Sign Out" className="py-2 cursor-pointer rounded-full hover:bg-gray-100" onClick={() => signOut()}>
    <LogOut className="h-4 w-4 text-gray-500 hover:text-red-500" />
  </button>
)
}

export default SignOut
