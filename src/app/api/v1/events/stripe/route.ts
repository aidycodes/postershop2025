import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { schema } from '@/server/db/schema'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { orders, orderitem } from '@/server/db/schema'
import { createId } from '@paralleldrive/cuid2'
const sql = neon(process.env.DATABASE_URL!)
const db = drizzle<typeof schema>(sql)

// Initialize Stripe with your secret key
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
   // console.log('🔒 Verified event:', event);
    // Handle different event types
    if(event.type === 'checkout.session.completed'){
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Checkout completed');
         if(session.metadata?.userId){
            console.log('✅ User ID found in metadata');
         }
     console.log(session.customer_email, session.amount_total, session.shipping_cost, session.shipping_cost?.amount_total, session.customer_details?.address)
 if(session.customer_details?.address){
    
     const addressKeysOrder = ['line1', 'line2', 'city', 'state', 'postal_code', 'country']; // Define your known keys in the desired order
     const addressEntries = Object.entries(session.customer_details.address);
     const sortedAddressEntries = addressKeysOrder
         .map(key => addressEntries.find(([k]) => k === key)) 
         .filter(entry => entry !== undefined); 
     const sortedAddress = sortedAddressEntries
         .map(([_, value]) => value)
         .join(', ');

         const order = await db.insert(orders).values({
            id: createId(),
            stripe_id: session.id,
            total: session.amount_total?.toString(),     
            status: 'paid',
            user_email: session.customer_email,
            deliveryAddress: sortedAddress,
            postage: session.shipping_cost?.amount_total === 0 ? 'free' : 'standard',
            postage_cost: session.shipping_cost?.amount_total?.toString() || '0'
         }).returning({id: orders.id})
        // Retrieve the session with line items expanded
        const expandedSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ['line_items', 'customer']
          }
        );       
       
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product']
        });
       if(order?.[0]?.id){
        const orderItems = await Promise.all(lineItems.data.map(async (item) => {
            const product = item?.price?.product;
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
                }
            }
        }));
                       
        } else {
            console.log('No Order Id');
        }
    
    }
}

    return NextResponse.json({ received: true });
   
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
}