import { cart } from "@/server/db/schema"
import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { eq, or } from "drizzle-orm"
import { cartitem } from "@/server/db/schema"
import { createId } from "@paralleldrive/cuid2"
import { HTTPException } from "hono/http-exception"
import { sql } from "drizzle-orm"
import {
    getSignedCookie,
    setSignedCookie,
    deleteCookie
  } from 'hono/cookie'
import { auth } from "@/lib/auth"
import { cookies } from "next/headers"


const userSessionSchema = z.object({
    id: z.string(),
    email: z.string().email(), 
    emailVerified: z.boolean(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    image: z.string().nullable(), 
  }).optional()

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

export const cartRouter = j.router({
  getCart: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx
    const secret = process.env.COOKIE_SECRET as string
    let guestToken = await getSignedCookie(c, secret)
    console.log(guestToken, 'guestToken')
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    })

    if(session?.user){ // if user is signed in
     
        if(guestToken.guestCartID){ // if user has a guest cart Cookie
            const guestCartId = await db.select({id: cart.id}).from(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))
        if(guestCartId[0]?.id){ // if guest cart id is found
            const guestCart = await db.select().from(cartitem).where(eq(cartitem.cartid, guestCartId[0]?.id )) // get items from guest cart           
        if(guestCart.length > 0){ // if guest cart has items
           const userCart = await db.select().from(cart).where(eq(cart.user_id, session.user.id)) // get user cart
        if(userCart.length === 0 ){ // if user has no cart
            const newCart = await db.insert(cart).values({ // create new cart
              id: createId(),
              user_id: session.user.id,      
            }).returning({id: cart.id})
            const addItems = await db.insert(cartitem).values(guestCart.map((item) => ({   // add guest items to user cart
              ...item,
              id: createId(),
              cartid: newCart[0]?.id
            })))
            const deleteGuestCart = await db.delete(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))
            const deleteGuestItems = await db.delete(cartitem).where(eq(cartitem.cartid, guestCartId[0]?.id))
            //delete cookies
             deleteCookie(c, "guestCartID")
             const userCartWithGuestItems = await db
                        .select({
                        cart: cart,
                        items: sql<CartItemType[]>`COALESCE(json_agg(${cartitem}) FILTER (WHERE ${cartitem.id} IS NOT NULL), '[]')`
                        })
                        .from(cart)
                        .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
                        .where(eq(cart.user_id, session.user.id))
                        .groupBy(cart.id)
                        return c.superjson({ cart: userCartWithGuestItems[0]?.cart, items: userCartWithGuestItems[0]?.items})
           } 
           // when user has cart
           const addItems = await db.insert(cartitem).values(guestCart.map((item) => ({   // add guest items to user cart
            ...item,
            id: createId(),
            cartid: userCart[0]?.id
          })))
          const deleteGuestCart = await db.delete(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))
          const deleteGuestItems = await db.delete(cartitem).where(eq(cartitem.cartid, guestCartId[0]?.id))
          //delete cookies
           deleteCookie(c, "guestCartID")
           const userCartWithGuestItems = await db
                      .select({
                      cart: cart,
                      items: sql<CartItemType[]>`COALESCE(json_agg(${cartitem}) FILTER (WHERE ${cartitem.id} IS NOT NULL), '[]')`
                      })
                      .from(cart)
                      .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
                      .where(eq(cart.user_id, session.user.id))
                      .groupBy(cart.id)
                      return c.superjson({ cart: userCartWithGuestItems[0]?.cart, items: userCartWithGuestItems[0]?.items})          
        }

        const deleteGuestCart = await db.delete(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))
        deleteCookie(c, "guestCartID")

    }
}
                //user is signed in and has no guest cart
    const userCartCheck = await db.select().from(cart).where(eq(cart.user_id, session.user.id)) // get user cart
        if(userCartCheck.length === 0 ){ // if user has no cart
            const newCart = await db.insert(cart).values({ // create new cart
              id: createId(),
              user_id: session.user.id,      
            }).returning({id: cart.id})
        }
            const userCart = await db
                .select({
                  cart: cart,
                  items: sql<CartItemType[]>`COALESCE(json_agg(${cartitem}) FILTER (WHERE ${cartitem.id} IS NOT NULL), '[]')`
                })
                .from(cart)
                .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
                .where(eq(cart.user_id, session.user.id))
                .groupBy(cart.id)
               
                return c.superjson({cart: userCart[0]?.cart, items: userCart[0]?.items})
            
} 
// guest logic below

    if(!guestToken.guestCartID){
        const id = createId()
        const guestCartID = await setSignedCookie(c, "guestCartID", id, secret, {
          path: "/",
          httpOnly: false,
          secure: true,
          sameSite: "Lax",
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
        return c.superjson({cart: {id: '123'}, items: []})
    }
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
         items: sql<CartItemType[]>`COALESCE(json_agg(${cartitem}) FILTER (WHERE ${cartitem.id} IS NOT NULL), '[]')`
      })
      .from(cart)
      .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
      .where(eq(cart.guest_token, guestToken.guestCartID))
      .groupBy(cart.id)

      return c.superjson({cart: userCart[0]?.cart, items: userCart[0]?.items})
    }
  
    return c.superjson({cart: userCart[0]?.cart, items: userCart[0]?.items})

}
return c.superjson({cart: {id: '123'}, items: []})
}),
  addToCart: publicProcedure
    .input(cartItemInput)
    .mutation(async ({ ctx, c, input }) => {

      const { db } = ctx
      const secret = process.env.COOKIE_SECRET as string
      let guestToken = await getSignedCookie(c, secret)
      const session = await auth.api.getSession({
        headers: c.req.raw.headers
      })

      if(session?.user){
        const userCart = await db.select().from(cart).where(eq(cart.user_id, session.user.id))
        if(userCart.length === 0){
          const newCart = await db.insert(cart).values({
            id: createId(),
            user_id: session.user.id,
          }).returning({id: cart.id})
          const cartItem = await db.insert(cartitem).values({
            id: createId(),
            cartid: newCart[0]?.id,
            productname: input.productname,
            productid: input.product_id,
            productimage: input.image,
            price: input.price.toString(),
            stripeid: input.stripeid,
            quantity: input.quantity,
            total: input.total.toString(),
            selected_options: input.options
          })
          return c.superjson({cartItem})
      } // if user cart exists
      const cartItems = await db.insert(cartitem).values({
        id: createId(),
        cartid: userCart[0]?.id,
        productname: input.productname,
        productid: input.product_id,
        productimage: input.image,
        price: input.price.toString(),
        stripeid: input.stripeid,
        quantity: input.quantity,
        total: input.total.toString(),
        selected_options: input.options
      })
      return c.superjson({cartItems})
      }
//guest logic below
      if(!guestToken.guestCartID){
        const id = createId()
        const guestCartID = await setSignedCookie(c, "guestCartID", id, secret, {
          path: "/",
          httpOnly: false,
          secure: true,
          sameSite: "Lax",
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
        return c.superjson({message: 'No Cookie Found'})
      }

      const cartId = await db.select({id: cart.id}).from(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))

      if(cartId.length === 0){ // if cart id is not found create a guest cart
        const newCart = await db.insert(cart).values({
          id: createId(),
          guest_token: guestToken.guestCartID
        }).returning({id: cart.id})

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
        .returning()

        return c.superjson({cartItem})
      }
     
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
        items: sql<CartItemType[]>`COALESCE(json_agg(${cartitem}) FILTER (WHERE ${cartitem.id} IS NOT NULL), '[]')`
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
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
      })


    if(!id){
      throw new HTTPException(400, {message: "No cart item ID found"})
    }
    if(session?.user){
      const userCart = await db.select().from(cart).where(eq(cart.user_id, session.user.id))
      if(userCart.length === 0){
        throw new HTTPException(400, {message: "No user cart found"})
      }
      const userCartItem = await db.update(cartitem).set({
        quantity: quantity,
        total: (+price * quantity).toString(),
        selected_options: options
      }).where(eq(cartitem.id, id as string))

      return c.json({message: "Cart item updated"})
    }
    //guest logic below
    if(!guestToken.guestCartID){
        throw new HTTPException(400, {message: "No guest cart ID found"})
      }
      const cartId = await db.select({id: cart.id}).from(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))
      if(cartId.length === 0){
        throw new HTTPException(400, {message: "No cart ID found"})
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
    const secret = process.env.COOKIE_SECRET as string
    let guestToken = await getSignedCookie(c, secret)
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
      })


    if(session?.user){
      const userCart = await db.select().from(cart).where(eq(cart.user_id, session.user.id))
      if(userCart.length === 0){
        throw new HTTPException(400, {message: "No user cart found"})
      }
      const userCartItem = await db.delete(cartitem).where(eq(cartitem.id, id))
      return c.json({message: "Cart item deleted"})
    }
    //guest logic below
   if(!guestToken.guestCartID){
    throw new HTTPException(400, {message: "No guest cart ID found"})
   }
   const cartId = await db.select({id: cart.id}).from(cart).where(eq(cart.guest_token, guestToken.guestCartID as string))
   if(cartId.length === 0){
    throw new HTTPException(400, {message: "No cart ID found"})
   }
    const userCartItem = await db.delete(cartitem).where(eq(cartitem.id, id))
    

    return c.json({message: "Cart item deleted"})
    }),
    serverCart: publicProcedure
    //.input(z.object({id: z.string()}))
    .query(async ({ ctx, c, input }) => {
      const { db } = ctx
      //const { id } = input
      const cookieStore = await cookies()
      const myCookies = cookieStore.getAll()
      console.log(myCookies, 'cookie333')
      //const userCart = await db.select().from(cart).where(eq(cart.user_id, session.user.id))
    })
})
