import { orders, user, orderitem } from "@/server/db/schema"
import { eq, desc } from "drizzle-orm"
import { z } from "zod"
import { j, protectedProcedure } from "../jstack"
import { cart } from "@/server/db/schema"

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
      
    //   if (!userCart) {
    //     // Create a new cart if none exists
    //     const newCart = await ctx.db.insert(cart).values({
    //       id: crypto.randomUUID(),
    //       user_id: userId,
    //     }).returning();
    //     return c.json(newCart[0])
    //   }
      
      return c.json(userCart)
    }),
})
