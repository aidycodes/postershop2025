import { products, categories, productsToCategory } from "@/server/db/schema"
import { desc, eq, ilike, sql } from "drizzle-orm"
import { z } from "zod"
import { j, publicProcedure, protectedProcedure } from "../jstack"


export const productsRouter = j.router({
  allProducts: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx
    const allProducts = await db.select().from(products)
    return c.superjson(allProducts ?? null)
  }),

  productByName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ c, ctx, input }) => {
      const { name } = input
      const { db } = ctx

      const product = await db.select().from(products).where(eq(products.productname, name))
      return c.json(product)
    }),
    productById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ c, ctx, input }) => {
      const { id } = input
      const { db } = ctx
      console.log('hellloooooo')



     // const product = await db.select().from(products).where(eq(products.productname, name))
      return c.json({message: "Product fetched successfully"})
    }),
    productsByCategory: publicProcedure
    .input(z.object({ category: z.string().min(1) }))
    .query(async ({ c, ctx, input }) => {
      const { category } = input
      const { db } = ctx
      const categoryId = await db.select().from(categories).where(eq(categories.name, category))
   if(!categoryId[0]) {
    return c.json({
      message: "Category not found"
    })
   }
      const data = await db
        .select({
          id: products.id,
          productname: products.productname,
          price: products.price,
          description: products.description,
          image: products.image,
          extra: products.extra,
          stock: products.stock,
          options: products.options
        })
        .from(products)
        .innerJoin(
          productsToCategory,
          eq(products.id, productsToCategory.product_id)
        )
        .where(eq(productsToCategory.category_id, categoryId[0].id));
      return c.json({
        data
      })
    }),
  searchProducts: publicProcedure
    .input(z.object({ 
      query: z.string().min(1),
      limit: z.number().min(1).max(50).default(10)
    }))
    .query(async ({ c, ctx, input }) => {
      const { query, limit } = input
      const { db } = ctx

      const searchResults = await db
        .select({
          id: products.id,
          productname: products.productname,
          price: products.price,
          description: products.description,
          image: products.image,
          stock: products.stock
        })
        .from(products)
        .where(sql`
          ${products.productname} ILIKE ${`%${query}%`} 
        `)
        .limit(limit);

      return c.json({
        message: "Search completed successfully",
        data: searchResults
      });
    }),
    getCategorys: publicProcedure.query(async ({ c, ctx }) => {
      const { db } = ctx
      const categorys = await db.select().from(categories)
      return c.json({
        message: "Categorys fetched successfully",
        data: categorys
    })
    }),
    getFeaturedProducts: publicProcedure.query(async ({ c, ctx }) => {
      const { db } = ctx
      const featuredProducts = await db.select().from(products).where(eq(products.isFeatured, true))
      console.log(featuredProducts, 'ddd')
      return c.json({
        data: featuredProducts
    })
}),
})
