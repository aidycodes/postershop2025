import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { schema } from "@/server/db/schema"

const sql = neon(process.env.DATABASE_URL as string)
export const db = drizzle(sql, { schema  })



export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {  
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    user:{
    deleteUser:{
        enabled: true,
        callBackUrl: process.env.BETTER_AUTH_URL as string
    }
    }
});

