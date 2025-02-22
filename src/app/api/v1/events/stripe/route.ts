import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { schema } from '@/server/db/schema'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { orders, orderitem, products } from '@/server/db/schema'
import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'
import { z } from 'zod';

const sql = neon(process.env.DATABASE_URL!) //connect to db
const db = drizzle<typeof schema>(sql)

const StockSchema = z.object({ 
    Small: z.number(),
    Medium: z.number(),
    Large: z.number(),
    XLarge: z.number(),
  });

 const StripeIdsSchema = z.object({
    Small: z.string(),
    Medium: z.string(),
    Large: z.string(),
    XLarge: z.string(),
  });
  const SizeSchema = z.object({
    'Large (A1 - 23.4" × 33" / 594 × 827 mm)': z.number(),
    'Medium (A2 - 16.5" × 23.4" / 420 × 594 mm)': z.number(),
    'Small (A3 - 11.7" × 16.5" / 297 × 420 mm)': z.number(),
    'XLarge (A0 - 33" × 46.8" / 827 × 1169 mm)': z.number(),
  });
  
  const jsonbSchema = z.object({
    sizes: SizeSchema,
    stripeIds: StripeIdsSchema,
    Stock: StockSchema,
  });

  
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    console.log('✅ Webhook received from Stripe');
    // Get the raw body for signature verification
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    // Verify the signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed.', err);
      return new NextResponse('Webhook signature verification failed.', { status: 400 });
    }

    if(event.type === 'checkout.session.completed'){
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Checkout completed');
    
 if(session.customer_details?.address){
    
     const addressKeysOrder = ['line1', 'line2', 'city', 'state', 'postal_code', 'country']; //parse address based on order
     const addressEntries = Object.entries(session.customer_details.address);
     const sortedAddressEntries = addressKeysOrder
         .map(key => addressEntries.find(([k]) => k === key))  //map address to order
         .filter(entry => entry !== undefined); 
     const sortedAddress = sortedAddressEntries
         .map(([_, value]) => value)
         .join(', ');

         if(session.metadata?.userId){ //create order if user is logged in
            console.log('✅ User ID found in metadata'); 
            const order = await db.insert(orders).values({
                id: createId(),
                stripe_id: session.id,
                user_id: session.metadata?.userId || null,
                total: session.amount_total?.toString(),     
                status: 'paid',
                user_email: session.customer_email,
                deliveryAddress: sortedAddress,
                postage: session.shipping_cost?.amount_total === 0 ? 'free' : 'standard',
                postage_cost: session.shipping_cost?.amount_total?.toString() || '0'
             }).returning({id: orders.id})
       
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product']
        });
       if(order?.[0]?.id){
        const orderItems = await Promise.all(lineItems.data.map(async (item) => { //create order items
            const product = item?.price?.product as Stripe.Product

            if (product && typeof product !== 'string' && 'images' in product) {
                const quantity = item?.quantity || 0;
                const price = item?.price?.unit_amount || 0;

                if (quantity !== undefined && price !== undefined) {
                    const orderItem = await db.insert(orderitem).values({
                        id: createId(),
                        orderid: order?.[0]?.id,
                        productid: product.id,
                        productname: product.name,
                        productimage: product.images[0],
                        quantity: Number(quantity),
                        price: price.toString(),
                    });
                    const productOptions = await db.select().from(products)
                                            .where(eq(products.id, product.metadata.db as string))    //get product for options 
                        if(productOptions[0]) {   
                        const options = productOptions?.[0]?.options  // get options
                        const parsedOptions = jsonbSchema.parse(options); //check if options are valid
                           if(parsedOptions){
                            const size = product.metadata.size as keyof typeof parsedOptions.Stock; //get size
                            const optionsObject = {...parsedOptions, 
                                Stock:{ 
                                    ...parsedOptions?.Stock,
                                    [size]: parsedOptions?.Stock?.[size] - quantity //stock object
                                }}
                        
                            const updateStock = await db.update(products).set({
                                options: optionsObject
                            }).where(eq(products.id, product.metadata.db as string)) //update stock
                            }
                        }        
                }
                
            }
        }))
    }
                       
        } else {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                expand: ['data.price.product']
              });
            console.log('✅ Guest order here');
            const guestorder = await db.insert(orders).values({
                id: createId(),
                stripe_id: session.id,
                total: session.amount_total?.toString(),     
                status: 'paid',
                user_email: session.customer_details.email,
                deliveryAddress: sortedAddress,
                postage: session.shipping_cost?.amount_total === 0 ? 'free' : 'standard',
                postage_cost: session.shipping_cost?.amount_total?.toString() || '0'
             }).returning({id: orders.id})
        console.log('✅ Guest orderId here', guestorder);
             if(guestorder?.[0]?.id){
                console.log('✅ Guest order created');
                const orderItems = await Promise.all(lineItems.data.map(async (item) => {
                    const product = item?.price?.product;
                    if (product && typeof product !== 'string' && 'images' in product) {
                        const quantity = item?.quantity || 0;
                        const price = item?.price?.unit_amount || 0;
        
                        if (quantity !== undefined && price !== undefined) {
                            const orderItem = await db.insert(orderitem).values({
                                id: createId(),
                                orderid: guestorder?.[0]?.id,
                                productid: product.id,
                                productname: product.name,
                                productimage: product.images[0],
                                quantity: Number(quantity),
                                price: price.toString(),
                            });
                            const productOptions = await db.select().from(products)
                                            .where(eq(products.id, product.metadata.db as string))    //get product for options 
                        if(productOptions[0]) {   
                        const options = productOptions?.[0]?.options  // get options
                        const parsedOptions = jsonbSchema.parse(options); //check if options are valid
                           if(parsedOptions){
                            const size = product.metadata.size as keyof typeof parsedOptions.Stock; //get size
                            const optionsObject = {...parsedOptions, 
                                Stock:{ 
                                    ...parsedOptions?.Stock,
                                    [size]: parsedOptions?.Stock?.[size] - quantity //stock object
                                }}
                        
                            const updateStock = await db.update(products).set({
                                options: optionsObject
                            }).where(eq(products.id, product.metadata.db as string)) //update stock
                            }
                        }
                        }
                    }
                }))
             }
        }
    
    }
}

    return NextResponse.json({ received: true });
   
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
}