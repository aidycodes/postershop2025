'use client'

import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const SignInSuccess = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    useEffect(() => {
       queryClient.invalidateQueries({ queryKey: ['cart'] })
        router.push('/')
    }, [])

    return (
        <div>
            <h1>Sign in successful</h1>
        </div>
    )
}

export default SignInSuccess