import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

const useSignUpEmail = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [SignUpLoading, setSignUpLoading] = useState(false)
    const {mutate: signUp,
        isPending: isSignUpPending,
         isError: isSignUpError,
          error: signUpError} = useMutation({
       mutationFn: async(data: {name: string, email: string, password: string}) => {
         setSignUpLoading(true)
         const result = await authClient.signUp.email({
           email: data.email,
           password: data.password,
           name: data.name,
         })
         if(result.error) {
           console.log(result.error)
           throw new Error(result.error.message || 'Something went wrong')
         }
         return result.data
       },
       onError: (error) => {
         console.log(error)
         setSignUpLoading(false)
       },
       onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey: ["user"]})
        router.push('/dashboard/user')
       }
     })
     return {signUp, isSignUpPending, isSignUpError, signUpError, SignUpLoading}
}

export default useSignUpEmail