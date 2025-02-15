import { cart } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { z } from "zod"
import { j, publicProcedure, protectedProcedure } from "../jstack"
import { eq, or } from "drizzle-orm"
import { cartitem } from "@/server/db/schema"
import { createId } from "@paralleldrive/cuid2"
import { HTTPException } from "hono/http-exception"

const cartItemInput = z.object({
  id: z.string().optional(),
  cartid: z.string().optional(),
  product_id: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  stripeid: z.string(),
  user_id: z.string(),
  productname: z.string(),
  image: z.string(),
  description: z.string(),
  options: z.array(z.string()).optional(),

})


export const postRouter = j.router({
  getCart: protectedProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx
    
    const userCart = await db.query.cart.findFirst({
        where: or(eq(cart.user_id, ctx.session.session.userId)),
        with: {
            items: true
        }
    })


    return c.superjson(userCart ?? null)
  }),

  addToCart: protectedProcedure
    .input(cartItemInput)
    .mutation(async ({ ctx, c, input }) => {
      console.log(input, 'input', 'dkdkdkdkd')
      const { db } = ctx
      let userCartId = input.cartid
      
      if(!input.cartid){

        const userCartCheck = await db.query.cart.findFirst({
          where: eq(cart.user_id, ctx.session.session.userId)
        })

        if(userCartCheck){
          userCartId = userCartCheck.id
        }
        
        if(!userCartCheck){

        const userCart = await db.insert(cart).values({
          user_id: ctx.session.session.userId,
          id:createId()
        }).returning()

        userCartId = userCart[0] && userCart[0].id
      }
    }

  if(userCartId){

    console.log(input, 'input', 'dkdkdkdkd')

    const userCartItem = await db.insert(cartitem).values({
      id: createId(),
      cartid: userCartId,
      productname: input.productname,
      productid: input.product_id,
      productimage: input.image,      
      productdescription: input.description,
      price: input.price.toString(),
      stripeid: input.stripeid,
      quantity: input.quantity,
      total: (input.price * input.quantity).toString()
    }).returning()
  
    const userCart = await db.query.cart.findFirst({
      where: eq(cart.id, userCartId),
      with: {
        items: true
      }
    })

      return c.superjson(userCart)
  }
  throw new HTTPException(500, {
    message: "Service Error"
  })
}),
updateCartItem: protectedProcedure
  .input(cartItemInput)
  .mutation(async ({ ctx, c, input }) => {
    if (!input.id) {
      throw new HTTPException(400, { message: "Cart item ID is required" })
    }
    const { db } = ctx
    const { quantity, price, options } = input
    const userCartItem = await db.update(cartitem)
      .set({
        quantity: quantity,
        total: (price * quantity).toString(),
        selected_options: options
      })
      .where(eq(cartitem.id, input.id))
      .returning()
        
      const userCart = await db.query.cart.findFirst({
        where: eq(cart.user_id, ctx.session.session.userId),
        with: {
          items: true
        }
      })

    return c.superjson(userCart)
  }),
  deleteCartItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, c, input }) => {
      const { db } = ctx
      const { id } = input

      const userCartItem = await db.delete(cartitem).where(eq(cartitem.id, id))

      const userCart = await db.query.cart.findFirst({
        where: eq(cart.user_id, ctx.session.session.userId),
        with: {
          items: true
        }
      })

      return c.superjson(userCart)
    })
  

})