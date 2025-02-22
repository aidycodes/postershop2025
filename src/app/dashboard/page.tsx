import { auth } from "@/lib/auth"
import { headers } from "next/headers"
 import { redirect } from "next/navigation"
 import SignOutButton from "../components/auth/SignOutButton"
const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
      redirect('/sign-in')
        
    }
    return (
        <div className="flex flex-col items-center h-screen gap-12">
            <h1>Welcome {session.user.name}</h1>
          <SignOutButton />
        </div>
    )
  }

  export default Page