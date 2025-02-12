import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { env } from "hono/adapter"
import { jstack } from "jstack"
import { auth } from "@/lib/auth"
import { HTTPException } from "hono/http-exception"
import { nullable } from "zod"
import { schema } from "@/server/db/schema"
interface Env {
  Bindings: { DATABASE_URL: string }
}

export const j = jstack.init<Env>()

/**
 * Type-safely injects database into all procedures
 * 
 * @see https://jstack.app/docs/backend/middleware
 */
const databaseMiddleware = j.middleware(async ({ c, next }) => {
  const { DATABASE_URL } = env(c)

  const sql = neon(DATABASE_URL)
  const db = drizzle<typeof schema>(sql)

  return await next({ db })
})

const authMiddleware = j.middleware(async ({ c, next }) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  })

   if(!session) {
    throw new HTTPException(401, { message: "Unauthorized" })
   }
   const { DATABASE_URL } = env(c)

  const sql = neon(DATABASE_URL)
  const db = drizzle(sql, { schema })
   return await next({ session, db })
})
/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware)
export const protectedProcedure = j.procedure.use(authMiddleware)