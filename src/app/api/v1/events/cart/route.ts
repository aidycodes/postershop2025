import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/auth"
import { cart, cartitem } from "@/server/db/schema"
import { eq, sql } from "drizzle-orm"
import { CartItemType } from "@/server/routers/cart-router"




export async function GET(req: NextRequest) {
            const cookieStore = await cookies()
            const guestCartID = cookieStore.get('guestCartID')
            console.log(guestCartID, 'guestCartID')
            const session = await auth.api.getSession({
                headers: await headers()
              })
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
                    return NextResponse.json({cart: userCart[0]?.cart || {id:123}, items: userCart[0]?.items || []})
                }
                return NextResponse.json({cart: {id:123}, items: []})

              
            }
            return NextResponse.json({cart: {id:123}, items: [{cartid:123, productid:123, quantity:1, price:123},
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               {cartid:123, productid:123, quantity:1, price:123}, 
               
              ]})
}
