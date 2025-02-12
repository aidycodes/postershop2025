import type { AppRouter } from "@/server"
import { createClient } from "jstack"

/**
 * Your type-safe API client
 * @see https://jstack.app/docs/backend/api-client
 */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const client = createClient<AppRouter>({
  baseUrl: apiUrl,
})
