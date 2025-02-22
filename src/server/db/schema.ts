import { pgTable, serial, text, timestamp, index, boolean, decimal, integer, primaryKey, check, jsonb, pgEnum, numeric } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"


export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
email: text('email').notNull().unique(),
emailVerified: boolean('email_verified').notNull(),
image: text('image'),
phone: text('phone'),
city: text('city'),
country: text('country'),
postal_code: text('postal_code'),
address: text('address'),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
token: text('token').notNull().unique(),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull(),
ipAddress: text('ip_address'),
userAgent: text('user_agent'),
userId: text('user_id').notNull().references(()=> user.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('account_id').notNull(),
providerId: text('provider_id').notNull(),
userId: text('user_id').notNull().references(()=> user.id),
accessToken: text('access_token'),
refreshToken: text('refresh_token'),
idToken: text('id_token'),
accessTokenExpiresAt: timestamp('access_token_expires_at'),
refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
scope: text('scope'),
password: text('password'),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
value: text('value').notNull(),
expiresAt: timestamp('expires_at').notNull(),
createdAt: timestamp('created_at'),
updatedAt: timestamp('updated_at')
});

export const categoriesDisplayEnum = pgEnum("categories_display", ["image", "text", "image_text"])

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  description: text("description"),
  display: categoriesDisplayEnum("display").default("image_text"),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});



export const categoryProductRelation = relations(categories, ({ many }) => ({
  productsToCategory: many(productsToCategory),
}));

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  pid: text("pid"),
  productname: text("productname").notNull(),
  price: decimal("price").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  extra: text("extra"),
  stock: text("stock"),
  options: jsonb("options").default('{}'),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  isFeatured: boolean("is_featured").default(false),
  is_Featured: boolean("isFeatured").default(false), //this one is to be removed
});



export const productCategoryRelation = relations(products, ({ many }) => ({
  productsToCategory: many(productsToCategory),
}));

export const productsToCategory = pgTable(
  "products_to_category",
  {
    product_id: text("product_id").notNull().references(() => products.id, {
      onDelete: "cascade",
    }),
    category_id: text("category_id").notNull().references(() => categories.id, {
      onDelete: "cascade",
    }),
  },

  (t) => ({
    pk: primaryKey({ columns: [t.product_id, t.category_id] }),
  })
);

export const productsToCategoryRelations = relations(
  productsToCategory,
  ({ one }) => ({
    products: one(products, {
      fields: [productsToCategory.product_id],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productsToCategory.category_id],
      references: [categories.id],
    }),
  })
);

export const orderitem = pgTable("orderitem", {
  id: text("id").primaryKey(),
  orderid: text("orderid").references(() => orders.id, {
    onDelete: "cascade",
  }),
  productname: text("productname"),
  productid: text("productid"),
  productimage: text("productimage"),
  productdescription: text("productdescription"),
  productextra: text("productextra"),
  price: text("price"),
  quantity: integer("qty"),
  total: text("total"),
  created_at: timestamp("created_at").defaultNow(),
  selected_options: jsonb("selected_options").default('{}'),
});

// export const orderStatus = pgEnum("order_status", [
//   "pending",
//   "dispatched",
//   "delivered",
//   "paid",
//   "canceled",
//   "refunded",
// ]);

export const orders = pgTable("order", {
  id: text("id").primaryKey(),
  stripe_id: text("stripe_id"),
  total: decimal("total"),
  user_id: text("userid").references(() => user.id,{onDelete: "set null"}),
  user_email: text("user_email"),
  deliveryAddress: text("user_address"),
  status: text("status").notNull(),
  postage: text("postage"),
  postage_cost: decimal("postage_cost"),
  tracking: text("tracking"),
  delivery_date: timestamp("delivery_date"),
  created_at: timestamp("create_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(orders, ({ one }) => ({
  user: one(user, {
    fields: [orders.user_id],
    references: [user.id],
  }),
}));

export const itemOrderRelation = relations(orders, ({ many }) => ({
  items: many(orderitem),
}));

export const orderItemRelations = relations(orderitem, ({ one }) => ({
  order: one(orders, {
    fields: [orderitem.orderid],
    references: [orders.id],
  }),
}));

export const cart = pgTable("cart", {
  id: text("id").primaryKey(),
  user_id: text("userid").references(() => user.id, {
    onDelete: "cascade",
  }),
  guest_token: text("guest_token"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userOrGuestCheck: check("cart_user_or_guest_check", sql`"userid" IS NOT NULL OR "guest_token" IS NOT NULL`)
  })

);

export const cartitem = pgTable("cartitem", {
  id: text("id").primaryKey(),
  cartid: text("cartid"),
  productname: text("productname"),
  productid: text("productid"),
  stripeid: text("stripeid"),
  productimage: text("productimage"),
  productdescription: text("productdescription"),
  productextra: text("productextra"),
  price: text("price"),
  quantity: integer("qty"),
  total: text("total"),
  created_at: timestamp("created_at").defaultNow(),
  selected_options: jsonb("selected_options").default('{}'),
});

export const cartRelation = relations(cart, ({ many }) => ({
  items: many(cartitem)
}));

export const cartItemRelations = relations(cartitem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartitem.cartid],
    references: [cart.id],
  }),
}));


// export const producthistory = pgTable("producthistory", {
//   id: text("id").primaryKey(),
//   name: text("name").notNull(),
//   description: text("description"),
//   image: text("image"),
// });

// export const insertProductSchema = createInsertSchema(products);
// export const insertOrderSchema = createInsertSchema(orders);
// export const insertcategorieschema = createInsertSchema(categories);
// export const insertOrderItemSchema = createInsertSchema(orderitem);
// export const insertProductTocategorieschema =
//   createInsertSchema(productsToCategory);
// export const insertAccountSchema = createInsertSchema(accounts);
// export const mergedSchemas = insertProductSchema.merge(insertOrderSchema);
//const category = z.object({ name: z.string(), id: z.string() });

// const productSchemaInput = insertProductSchema.extend({
//   price: z.string().min(1, {
//     message: "Price must be at least 1 digit or greater.",
//   }),
//   productname: z.string().min(2, {
//     message: "Product name must be at least 2 characters.",
//   }),
//   id: z.string().optional(),
// });

// const category = z.string().optional();
// export const productApiSchema = z.object({
//   insertProductSchema: productSchemaInput.pick({
//     id: true,
//     productname: true,
//     description: true,
//     price: true,
//     stock: true,
//     image: true,
//   }),

//   category: z.array(category),
// });


export const schema = {
  user,
  session,
  account,
  verification,
  categories,
  products,
  productsToCategory,
  orders,
  orderitem,
  cart,
  cartitem,
  cartRelation,
  cartItemRelations,
  itemOrderRelation,
  orderItemRelations,
  usersRelations,
  productsToCategoryRelations,
  productCategoryRelation,
  categoryProductRelation,
}