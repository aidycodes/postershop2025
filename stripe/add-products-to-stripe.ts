import "dotenv/config";
import { Products } from '../seed/data'
import Stripe from 'stripe'
import fs from 'fs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

async function createSizeProducts() {
  for (const product of Products) {
    for (const [sizeName, price] of Object.entries(product.options.sizes)) {
   
      
  const result = await retryWithBackoff(async () => {
        const stripeProduct = await stripe.products.create({
          name: `${product.productname} - ${sizeName.split(' ')[0]}`,
          default_price_data: { unit_amount: +price * 100, currency: 'gbp' },
          images: [product.image],
        });
        if(result){
          await logSuccessToFile(stripeProduct)
        }
        return stripeProduct
      });
      console.log(result)
    }
  }
}

// Exponential backoff function
export async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 10, delay = 2000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
       // Success, exit function
    } catch (error: any) {
      if (error.code === 'rate_limit' && attempt < retries - 1) {
        console.log(`Rate limit hit, retrying in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // Exponential increase
      } else {
        console.error('Failed after retries:', error);
        throw error; // Stop retrying for non-rate-limit errors
      }
    }
  }
}

async function logSuccessToFile(product: Stripe.Product) {
  const logMessage = `Successfully added product: ${product.name}, ID: ${product.id}\n`;

  try {
    await fs.promises.appendFile('successful_products.log', logMessage);
    console.log(`Logged product: ${product.name}`);
  } catch (error) {
    console.error('Failed to log product:', error);
  }
}
  
  createSizeProducts()
