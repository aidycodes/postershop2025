
import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { createCheckoutSession } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { user } from "@/server/db/schema"
import { eq } from "drizzle-orm"
//zod schema for input
const createCheckoutSessionSchema = z.object({
  
  cartItems: z.array(z.object({
    quantity: z.number(),
    name: z.string(),
    stripeid: z.string(),
    frame: z.boolean(),
    price: z.string(),
  })),
})


export const paymentRouter = j.router({
  create: publicProcedure
    .input(createCheckoutSessionSchema)
    .mutation(async ({ ctx, c, input }) => {
      const { cartItems } = input
      const { db } = ctx
      const session = await auth.api.getSession({
        headers: c.req.raw.headers
      })
 if (!session) {
    const checkoutsession = await createCheckoutSession({
        cartItems,
        userEmail: 'guest',
        userId: 'guest',
    })
    return c.json({url: checkoutsession.url})
}
    if(session){
    const currentUser = await db.select().from(user).where(eq(user.id, session.session.userId))
    if(!currentUser){
        return c.json({error: 'User not found'}, 404)
    }
    if(currentUser[0]){
    const checkoutsession = await createCheckoutSession({
        cartItems,
        userEmail: currentUser[0].email,
        userId: currentUser[0].id,
    })
    return c.json({url: checkoutsession.url})
}
    }
  })
    
 })
    

