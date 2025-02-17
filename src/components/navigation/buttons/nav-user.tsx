
import Link from "next/link"
import { User } from "lucide-react"
import SignedInUser from "./signed-in-user"
const NavUser = ({isSignedIn, name}: {isSignedIn: boolean, name?: string}) => {

    
    return (
        <div>            
            {isSignedIn ? (       
            <SignedInUser name={name ? name : ""} />
                ) : (
                <Link href="/sign-in">
                    <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                        <User className="h-6 w-6" />
                        <span>Sign in</span>
                    </div>
                </Link>
                )}
            </div>
    )
}

export default NavUser
