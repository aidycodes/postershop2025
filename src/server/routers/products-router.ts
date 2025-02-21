import { products, categories, productsToCategory, orderitem } from "@/server/db/schema"
import { desc, eq, ilike, sql, inArray } from "drizzle-orm"
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

      const exactProduct = await db.select().from(products).where(eq(products.productname, name));

      if (!exactProduct.length) {
        const likeProduct = await db.select().from(products)
          .where(ilike(products.productname, name));
        return c.json(likeProduct);
      }

      return c.json(exactProduct);
    }),
    productById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ c, ctx, input }) => {
      const { id } = input
      const { db } = ctx
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
        data: [],
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
        .where(ilike(products.productname, `%${query}%`)) 
        .limit(limit)

      return c.json(
        searchResults
      );
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
      
      return c.json({
        data: featuredProducts
    })
}),
getNewArrivals: publicProcedure.query(async ({ c, ctx }) => {
  const { db } = ctx
  const newArrivals = await db.select().from(products).orderBy(desc(products.created_at)).limit(8)
  return c.json({
    data: newArrivals
  })
}),
getBestSellers: publicProcedure.query(async ({ c, ctx }) => {
  const { db } = ctx
  const sales = await db
  .select({
    productName: orderitem.productname,
    totalCount: sql<number>`sum(${orderitem.quantity}) * count(*)`,
  })
  .from(orderitem)
  .groupBy(orderitem.productname)
  .orderBy(sql`sum(${orderitem.quantity}) * count(*) desc`)
  .limit(8);
console.log(sales, 'sales')
  if(sales.length === 0) {
    console.log('no sales')
    const data = await db.select().from(products).limit(8)
    console.log(data, 'data')
    return c.json({
      data
    })
  }
  const bestSellers = await db.select()
    .from(products)
    .where(
      inArray(
        products.productname, 
        sales.map(sale => sale.productName).filter((name): name is string => name !== null)
      )
    );
  return c.json({
    data: bestSellers
  })
})
})
