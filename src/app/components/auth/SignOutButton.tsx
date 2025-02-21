"use client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const SignOutButton = () => {
    const router = useRouter()
    const handleSignOut = async () => {
     const res =    await authClient.signOut()
        if(res.error) {
            console.log(res.error)
        }
        if(res.data?.success){
        router.push('/sign-in')
        }
    }
    return <button className="bg-blue-500 text-white px-6 py-2 cursor-pointer rounded-md" onClick={() => handleSignOut()}>Sign Out</button>
}

export default SignOutButton