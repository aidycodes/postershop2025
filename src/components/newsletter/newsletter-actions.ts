'use server'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email(),
})

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get('email')
  const parsed = signUpSchema.safeParse({ email })
  
  if (!parsed.success) {
    return { error: "Invalid email address" }
  }
  
  return { success: "You have been subscribed!" }
} 