import { orders, user, orderitem } from "@/server/db/schema"
import { eq, desc, count } from "drizzle-orm"
import { z } from "zod"
import { j, protectedProcedure, publicProcedure } from "../jstack"
import { cart } from "@/server/db/schema"
import { HTTPException } from "hono/http-exception"
import { getCookie } from "hono/cookie"

import { cookies } from "next/headers"

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
      if(!currentUser[0]) {
        throw new HTTPException(404, {
          message: "User not found"
        })
      }

      // user is already available in ctx from the protectedProcedure
      return c.json(
        currentUser[0]
      )
    }),
 
  // Get user's orders
  myOrders: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(1),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ c, ctx, input }) => {
      const { userId } = ctx.session.session
      const { limit = 10, offset = 0 } = input ?? {}
      //order count
      const [userOrders, totalOrders] = await Promise.all([
        ctx.db.select().from(orders).where(eq(orders.user_id, userId)).orderBy(desc(orders.created_at)).limit(limit).offset(offset),
        ctx.db.select({count:count()}).from(orders).where(eq(orders.user_id, userId)).limit(1).offset(0)
      ])
      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        userOrders.map(async (order) => {
          const orderItems = await ctx.db
            .select()
            .from(orderitem)
            .where(eq(orderitem.orderid, order.id))
            
          return {
            ...order,
            orderItems, // Include the order items in the order object
          };
        })
      );
      const orderCount = totalOrders[0]?.count ?? 0

      return c.superjson({  
        ordersWithItems,
        orderCount
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
