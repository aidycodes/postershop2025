import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

const useSignInEmail = () => {
    const router = useRouter()
    const {mutate: signIn,
        isPending: isSignInPending,
         isError: isSignInError,
          error: signInError} = useMutation({
           mutationFn: async(data: {email: string, password: string}) => {
           console.log(data)
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
       },
       onSuccess: (data) => {
        router.push('/')
       }

     })
     return {signIn, isSignInPending, isSignInError, signInError}
}

export default useSignInEmail