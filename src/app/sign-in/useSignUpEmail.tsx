import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

const useSignUpEmail = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const {mutate: signUp,
        isPending: isSignUpPending,
         isError: isSignUpError,
          error: signUpError} = useMutation({
       mutationFn: async(data: {name: string, email: string, password: string}) => {
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
       },
       onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey: ["user"]})
        router.push('/dashboard/user')
       }
     })
     return {signUp, isSignUpPending, isSignUpError, signUpError}
}

export default useSignUpEmail