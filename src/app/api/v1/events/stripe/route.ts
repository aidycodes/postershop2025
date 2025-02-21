import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { schema } from '@/server/db/schema'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { orders, orderitem, products } from '@/server/db/schema'
import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'
const sql = neon(process.env.DATABASE_URL!)
const db = drizzle<typeof schema>(sql)

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

type ProductOptions = {
    Stock: { [key: string]: number }
    sizes: { [key: string]: number }
}

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
    
     const addressKeysOrder = ['line1', 'line2', 'city', 'state', 'postal_code', 'country']; // Define your known keys in the desired order
     const addressEntries = Object.entries(session.customer_details.address);
     const sortedAddressEntries = addressKeysOrder
         .map(key => addressEntries.find(([k]) => k === key)) 
         .filter(entry => entry !== undefined); 
     const sortedAddress = sortedAddressEntries
         .map(([_, value]) => value)
         .join(', ');

         if(session.metadata?.userId){
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
        const orderItems = await Promise.all(lineItems.data.map(async (item) => {
            const product = item?.price?.product as Stripe.Product

            console.log(JSON.stringify(product?.metadata), 'product000')
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
                    const productOptions = await db.select().from(products).where(eq(products.id, product.metadata.db as string))
                    console.log(productOptions?.[0]?.options, 'productOptions')
                 
                        const size = product.metadata.size as string;
                        const options = productOptions?.[0]?.options as ProductOptions
                     
                        if(options.Stock){
                            if(options?.Stock?.[size]){
                            const optionsObject = {...options, 
                                Stock:{ 
                                    ...options?.Stock,
                                    [size]: options?.Stock?.[size] - quantity
                                }}
                        
                            const updateStock = await db.update(products).set({
                                options: optionsObject
                            }).where(eq(products.id, product.metadata.db as string))
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