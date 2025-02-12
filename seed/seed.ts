import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Cats, Products } from "./data";
import { createId } from '@paralleldrive/cuid2';
import "dotenv/config";

import * as schema from "@/server/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });


async function main() {
    try {
        console.log("Seed started...");

        const categoryData = Cats.map((cat) => ({
            ...cat,
            createdAt: new Date(),
            updatedAt: new Date(),
            id: createId(),
            display: "image_text" as const
        }));
    
        const category = await db.insert(schema.categories).values(categoryData).returning();

        const productData = Products.map((product) => ({
            productname: product.productname,
            description: product.description,
            image: product.image,
            price: product.price.toString(),
            stock: product.stock,
            id: createId(),
            options: JSON.stringify(product.options)
        }));

        const productDB = await db.insert(schema.products).values(productData).returning()

        const productToCategoryItems = Products.map((product) => {
            const productId = productDB.find((p) => p.productname === product.productname)?.id;
            const categoryIds = product.cats?.map((cat) => category.find((c) => c.name.toLowerCase() === cat.toLowerCase())?.id);
            return {
                productId,
                categoryIds
            }
        });
        
    
        const productToCategoryValues = productToCategoryItems.flatMap((item) => 
            item.categoryIds?.map((categoryId) => ({
                product_id: item.productId!,
                category_id: categoryId!
            })) ?? []
        );

   
        const productToCategory = await db.insert(schema.productsToCategory)
            .values(productToCategoryValues)
            .returning();

        console.log("Seed finished...");


    } catch (error) {
        console.error(error);
        throw new Error("Seed error...");
    }
}
main();