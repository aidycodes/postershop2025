import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { retryWithBackoff } from './add-products-to-stripe';

type Product = {
    productName: string;
    productId: string;
    pricesID?: string[]
}

type ProductWithPriceSizeIds = {
    productName: string;
    productId: string;
    options: {
        stripeIds: { [key: string]: string}
    }
}

import fs from 'fs/promises'; // Import the file system module

async function saveProductsToFile(products: Product[]) {
  
    const jsonData = JSON.stringify(products, null, 2); // Convert to readable JSON format

    try {
        await fs.writeFile('productsWithStripIds3.json', jsonData, 'utf8'); // Write data to file
        console.log('✅ Products saved to productsWithStripIds3.json');
    } catch (error) {
        console.error('❌ Error saving products:', error);
    }
}

// Call the function




const exampleProduct: Product[] = [{
    productName: "test - Large",
    productId: "test",
    pricesID: ["test"]
},
{
    productName: "test - Medium",
    productId: "test",
    pricesID: ["test"]
},
{
    productName: "test - Small",
    productId: "test",
    pricesID: ["test"]
}
]

async function getProductsWithPrices() {
    try{
    const products = await stripe.products.list({limit: 100, starting_after: "prod_RldIvPxaCUp74j"}); // Fetch all products
    const productData: Product[] = products.data.map(product => ({
        productName: product.name,
        productId: product.id,
        pricesID: product.default_price ? [product.default_price as string] : undefined
    }));
     
    

    const productWithPriceSizeIds = productData.reduce<ProductWithPriceSizeIds[]>((acc, product) => {

        const productName = product.productName.split(" - ").slice(0, -1).join(" - ")

        const size = product.productName.split(" - ")[product.productName.split(" - ").length-1]

   
        
        const foundProduct = acc.find((p) => p.productName === productName)
        if(foundProduct){
            foundProduct.options.stripeIds[size as string] = product.pricesID?.[0] as string
            return acc
        }
        
     return [...acc, {productName: productName, productId: product.productId, options: {stripeIds: {
        [size as string]: product.pricesID?.[0] as string
    },
    "Stock": {
    "Large": Math.floor(Math.random() * 100) + 1,
    "Small": Math.floor(Math.random() * 100) + 1,
    "Medium": Math.floor(Math.random() * 100) + 1,
    "XLarge": Math.floor(Math.random() * 100) + 1
  },
  "sizes": {
    "Large (A1 - 23.4\" × 33\" / 594 × 827 mm)": 30,
    "Small (A3 - 11.7\" × 16.5\" / 297 × 420 mm)": 10,
    "XLarge (A0 - 33\" × 46.8\" / 827 × 1169 mm)": 40,
    "Medium (A2 - 16.5\" × 23.4\" / 420 × 594 mm)": 20
  },
}}]
    }, []);
    saveProductsToFile(productWithPriceSizeIds)
 
    } catch (error) {
        console.error(error);
    }
  }
  
  getProductsWithPrices()