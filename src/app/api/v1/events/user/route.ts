import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/auth"
import { user } from "@/server/db/schema"
import { eq } from "drizzle-orm"


export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
      })
    if(session?.user){
        const currentUser = await db.select().from(user).where(eq(user.id, session.user.id))
        return NextResponse.json({user: currentUser[0]})
    }
    return NextResponse.json({user: null})
}
