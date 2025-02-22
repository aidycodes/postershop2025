import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
})

const FrameId = 'price_1Qsl9YFzkPWWZeDIhmrgSpdH'

const StandardShipping = [
    {
        shipping_rate:'shr_1QslHFFzkPWWZeDIzCmgv2Px',
    }
  ]

  const FreeShipping = [
    {
        shipping_rate:'shr_1QslbbFzkPWWZeDIfrRX4rc4',
    }
  ]
    

export const createCheckoutSession = async({userEmail, userId, cartItems }: {userEmail?: string, userId?: string, cartItems: any[]}) => {

    const cartItemsTotalFrames = cartItems.reduce((acc, item) => item.frame ? acc + (item.quantity * 1) : acc, 0)
    const cartItemsTotal = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0)
  const cartItemArray = cartItems.map((item) => ({price: item.stripeid, quantity: item.quantity}))
 if(userId){
 
    const session = await stripe.checkout.sessions.create({
        shipping_options: cartItemsTotal > 50 ? FreeShipping : StandardShipping ,
        line_items: cartItemsTotalFrames > 0 ? [...cartItemArray, {price: FrameId, quantity: cartItemsTotalFrames}] : cartItemArray,
        mode: "payment",
        billing_address_collection: 'required',
        
        allow_promotion_codes: true,

        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/ordercomplete?success={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        customer_email: userEmail,
        metadata: {
            userId: userId || null,
          
        }
    });
    return session;
  }
  const session = await stripe.checkout.sessions.create({
    shipping_options: cartItemsTotal > 50 ? FreeShipping : StandardShipping ,
    line_items: cartItemsTotalFrames > 0 ? [...cartItemArray, {price: FrameId, quantity: cartItemsTotalFrames}] : cartItemArray,
    mode: "payment",
    billing_address_collection: 'required',
    
    allow_promotion_codes: true,

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/ordercomplete?success={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
   
});
    return session;
}
