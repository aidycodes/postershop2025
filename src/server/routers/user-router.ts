import { orders, user, orderitem } from "@/server/db/schema"
import { eq, desc } from "drizzle-orm"
import { z } from "zod"
import { j, protectedProcedure } from "../jstack"
import { cart } from "@/server/db/schema"
import { HTTPException } from "hono/http-exception"

export const usersRouter = j.router({
  // Get current user
  me: protectedProcedure
    .query(async ({ c, ctx }) => {
      const { userId } = ctx.session.session
      const currentUser = await ctx.db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1)
      

      // user is already available in ctx from the protectedProcedure
      return c.json({
        currentUser
      })
    }),
 
  // Get user's orders
  myOrders: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0)
    }).optional())
    .query(async ({ c, ctx, input }) => {
      const { userId } = ctx.session.session
      const { limit = 10, offset = 0 } = input ?? {}

     const userOrders = await ctx.db.query.orders.findMany({
        where: eq(orders.user_id, userId),
        with: {
            orderItems:true
        },
        limit: limit,
        offset: offset,
        orderBy: desc(orders.created_at)
     })

      return c.superjson({  
        userOrders
      });

    }),

    // Get user's cart
    cart: protectedProcedure
    .query(async ({ c, ctx }) => {
      const { userId } = ctx.session.session
      const userCart = await ctx.db.query.cart.findFirst({
        where: eq(cart.user_id, userId),
        with: {
          items: true  // This should now work with the proper relations
        }
      })

      return c.json(userCart)
    }),
    updateUser: protectedProcedure.input(z.object({name:z.string(), email:z.string(), phone:z.string(), city:z.string(), country:z.string(), postal_code:z.string(), address:z.string()}))
    .mutation(async ({ c, ctx, input }) => {
      const { userId } = ctx.session.session
      const { name, email, phone, city, country, postal_code, address } = input
      const updatedUser = await ctx.db.update(user).set({
        name,
        email,
        phone,
        city,
        country,
        postal_code,
        address
      }).where(eq(user.id, userId)).returning()
 console.log(input)
         if(!true){
            throw new HTTPException(300, {
                message: "Failed to update user"
            })
         }
      return c.json(updatedUser)

    })
})
