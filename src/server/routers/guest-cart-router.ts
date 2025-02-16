import { cart } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { z } from "zod"
import { j, publicProcedure, protectedProcedure } from "../jstack"
import { eq, or } from "drizzle-orm"
import { cartitem } from "@/server/db/schema"
import { createId } from "@paralleldrive/cuid2"
import { HTTPException } from "hono/http-exception"
import { sql } from "drizzle-orm"
import {
    getSignedCookie,
    setSignedCookie,
  } from 'hono/cookie'

export type SelectedOptions = {
    [key: string]: string
}
export const selectedOptionsSchema = z.record(z.string(), z.unknown()).default({}).optional()
const cartItemInput = z.object({

  id: z.string().optional(),
  cartid: z.string().optional(),
  product_id: z.string(),
  stripeid: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  user_id: z.string().optional(),
  productname: z.string(),
  image: z.string().optional(),
  total: z.number(),
  options: selectedOptionsSchema,

})

export type CartItemType = {
    productname: string;
    price: string;
    product_id: string;
    qty: number;
    id: string
    stripeid: string;
    productimage?: string | undefined;
    user_id?: string | undefined;
    cartid?: string | undefined;
    created_at?: Date 
    selected_options?: SelectedOptions | {};

}

export type CartItem = z.infer<typeof cartItemInput>

export const GuestCartRouter = j.router({
  getCart: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx

    const secret = process.env.COOKIE_SECRET as string
    let guestToken = await getSignedCookie(c, secret)


    if(!guestToken.guestCartID){
     const guestCartID = await setSignedCookie(c, "guestCartID", createId(), secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    guestToken = await getSignedCookie(c, secret) 
    }
    console.log({guestToken})
    if(guestToken && guestToken.guestCartID)  {  
    const userCart = await db
    .select({
      cart: cart,
      items: sql<CartItemType[]>`COALESCE(json_agg(${cartitem}) FILTER (WHERE ${cartitem.id} IS NOT NULL), '[]')`
    })
    .from(cart)
    .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
    .where(eq(cart.guest_token, guestToken.guestCartID))
    .groupBy(cart.id)

    if(userCart.length === 0){
      const newCart = await db.insert(cart).values({
        id: createId(),
        guest_token: guestToken.guestCartID
      })
      const userCart = await db
      .select({
        cart: cart,
         items: sql<CartItemType[]>`json_agg(${cartitem}) as items`
      })
      .from(cart)
      .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
      .where(eq(cart.guest_token, guestToken.guestCartID))
      .groupBy(cart.id)

      return c.superjson({cart: userCart[0]?.cart, items: userCart[0]?.items})
    }
  
    return c.superjson({cart: userCart[0]?.cart, items: userCart[0]?.items})

}
return c.superjson(null)
}),


  addToCart: publicProcedure
    .input(cartItemInput)
    .mutation(async ({ ctx, c, input }) => {

      const { db } = ctx
      const secret = process.env.COOKIE_SECRET as string
      let guestToken = await getSignedCookie(c, secret)
 console.log(input, 'input', input.options?.frame)
      if(!guestToken.guestCartID){
        const guestCartID = await setSignedCookie(c, "guestCartID", createId(), secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
        guestToken = await getSignedCookie(c, secret) 
        const newCart = await db.insert(cart).values({
          id: createId(),
          guest_token: guestToken.guestCartID as string
        }).returning()

        const cartItem = await db.insert(cartitem).values({
          id: createId(),
          cartid: newCart[0]?.id,
          productname: input.productname,
          productid: input.product_id,
          productimage: input.image,
          price: input.options?.frame ? (input.price + 29.99).toFixed(2).toString() : input.price.toString(),
          stripeid: input.stripeid,
          quantity: input.quantity,
          total: input.options?.frame ? (input.total + 29.99).toFixed(2).toString() : input.total.toString(),
          selected_options: input.options
        })
        const guestCart = await db

        .select({
          cart: cart,
          items: sql<typeof cartitem[]>`json_agg(${cartitem})`
        })
        .from(cart)
        .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
        .where(eq(cart.guest_token, guestToken.guestCartID as string))
        .groupBy(cart.id)
        return c.superjson(guestCart)
      }

      const cartId = await db.select({id: cart.id}).from(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))
     
      const cartItem = await db.insert(cartitem).values({
        id: createId(),
        cartid: cartId[0]?.id,
        productname: input.productname,
        productid: input.product_id,
        productimage: input.image,
        price: input.options?.frame ? (input.price + 29.99).toFixed(2).toString() : input.price.toString(),
        stripeid: input.stripeid,
        quantity: input.quantity,
        total: input.options?.frame ? (input.total + 29.99).toFixed(2).toString() : input.total.toString(),
        selected_options: input.options
      })
      .returning()


      const guestCart = await db
      .select({
        cart: cart,
        items: sql<typeof cartitem[]>`json_agg(${cartitem})`
      })
      .from(cart)
      .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
      .where(eq(cart.guest_token, guestToken.guestCartID as string))
      .groupBy(cart.id)
      return c.superjson(guestCart)

}),
updateCartItem: publicProcedure
  .input(z.object({id: z.string(), price: z.string(), quantity: z.number(), options: z.array(z.string()).optional()}))
  .mutation(async ({ ctx, c, input }) => {
    
    const { db } = ctx
    const { quantity, options, price, id } = input

    const secret = process.env.COOKIE_SECRET as string
    let guestToken = await getSignedCookie(c, secret)

    if(!guestToken.guestCartID){
      throw new HTTPException(400, {message: "No guest cart ID found"})
    }

    if(!id){
      throw new HTTPException(400, {message: "No cart item ID found"})
    }
    
    const userCartItem = await db.update(cartitem).set({
      quantity: quantity,
      total: (+price * quantity).toString(),
      selected_options: options
    }).where(eq(cartitem.id, id as string))

    return c.json({message: "Cart item updated"})
  }),
  deleteCartItem: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, c, input }) => {
    
    const { db } = ctx
    const { id } = input

    const userCartItem = await db.delete(cartitem).where(eq(cartitem.id, id))
    const secret = process.env.COOKIE_SECRET as string

    return c.json({message: "Cart item deleted"})
    })
})
