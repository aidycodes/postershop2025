import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
const useSignInEmail = () => {
    const router = useRouter()
    const [SignInLoading, setSignInLoading] = useState(false)
    const queryClient = useQueryClient()
    const {mutate: signIn,
        isPending: isSignInPending,
         isError: isSignInError,
          error: signInError} = useMutation({
           mutationFn: async(data: {email: string, password: string}) => {
           console.log(data)
           setSignInLoading(true)
            const result =  await authClient.signIn.email({
             email: data.email,
             password: data.password,
    
            })
         if(!result.data && result.error?.code) {
           throw new Error(result.error.message || 'Something went wrong')
         }
         return result.data
       },
       onError: (error) => {
         console.log(error)
         setSignInLoading(false)
       },
       onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey: ["user"]})
        router.push('/')
       
       }

     })
     return {signIn, isSignInPending, isSignInError, signInError, SignInLoading}
}

export default useSignInEmail