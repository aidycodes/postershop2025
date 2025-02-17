
import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { createCheckoutSession } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { user } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { orders } from "@/server/db/schema"
import { cart } from "@/server/db/schema"
import { cartitem } from "@/server/db/schema"
import { getSignedCookie } from "hono/cookie"
//zod schema for input
const createCheckoutSessionSchema = z.object({
  rawItems: z.array(z.object({}).passthrough()),
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
      try{
      const { cartItems } = input
      const { db } = ctx
      const session = await auth.api.getSession({
        headers: c.req.raw.headers
      })
 if (!session) {
    const checkoutsession = await createCheckoutSession({
        cartItems,
    })
    return c.json({url: checkoutsession.url})
}
    if(session){
    const currentUser = await db.select().from(user).where(eq(user.id, session.session.userId))
    console.log(currentUser, 'currentUser')
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
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return c.json({ error: "Failed to create checkout session" }, 500);
  }
}),
getSuccessfulOrder: publicProcedure
    .input(z.object({
        stripeId: z.string(),
    }))
    .query(async ({ c, ctx, input }) => {
        const { stripeId } = input
        const { db } = ctx
        const secret = process.env.COOKIE_SECRET as string
        let guestToken = await getSignedCookie(c, secret)
        const session = await auth.api.getSession({
          headers: c.req.raw.headers
        })
        const order = await db.select().from(orders).where(eq(orders.stripe_id, stripeId))
        if(session){
          const cartid = await db.select({id: cart.id}).from(cart).where(eq(cart.user_id, session.session.userId))
          if(cartid[0]){
          const deleteCartItems = await db.delete(cartitem).where(eq(cartitem.cartid, cartid[0].id))
        } 
        else {
          const cartid = await db.select({id: cart.id}).from(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))
          if(cartid[0]){
            const deleteCartItems = await db.delete(cartitem).where(eq(cartitem.cartid, cartid[0].id))
          }
        }
      }
        return c.superjson(order)
    })
})
    

