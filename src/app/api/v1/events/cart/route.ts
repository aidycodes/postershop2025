import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/auth"
import { cart, cartitem } from "@/server/db/schema"
import { eq, sql } from "drizzle-orm"
import { CartItemType } from "@/server/routers/cart-router"




export async function GET(req: NextRequest) {
  console.log('cart route')

            const cookieStore = await cookies()
            const guestCartID = cookieStore.get('guestCartID')
            console.log(guestCartID, 'guestCartID')
            console.log(cookieStore, 'cookieStore')
            console.log(req, 'req')

            const session = await auth.api.getSession({
                headers: await headers()
              })
            console.log(session, 'session')
            if(session?.user){
                const userCart = await db
                .select({
                  cart: cart,
                  items: sql<CartItemType[]>`COALESCE(json_agg(${cartitem}) FILTER (WHERE ${cartitem.id} IS NOT NULL), '[]')`
                })
                .from(cart)
                .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
                .where(eq(cart.user_id, session.user.id))
                .groupBy(cart.id)
                console.log(userCart, 'userCart')
                return NextResponse.json({cart: userCart[0]?.cart || {id:123}, items: userCart[0]?.items || []})
            }
            if(guestCartID){
             const quest_token = guestCartID.value.split('.')[0] as string
             
                const userCart = await db
                .select({
                  cart: cart,
                  items: sql<CartItemType[]>`COALESCE(json_agg(${cartitem}) FILTER (WHERE ${cartitem.id} IS NOT NULL), '[]')`
                })
                .from(cart)
                .leftJoin(cartitem, eq(cart.id, cartitem.cartid))
                .where(eq(cart.guest_token, quest_token))
                .groupBy(cart.id)
                if(userCart.length > 0){
                  console.log('guestcart', userCart)
                    return NextResponse.json({cart: userCart[0]?.cart || {id:123}, items: userCart[0]?.items || []})
                }
                console.log('no cart')
                return NextResponse.json({cart: {id:123}, items: []})

              
            }
            console.log('no session')
            return NextResponse.json({cart: {id:123}, items: [{cartid:123, productid:123, quantity:1, price:123},
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               
              ]})
}
