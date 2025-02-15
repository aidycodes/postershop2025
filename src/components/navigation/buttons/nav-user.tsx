import Link from "next/link"
import { User } from "lucide-react"

const NavUser = ({isSignedIn, name}: {isSignedIn: boolean, name?: string}) => {
    return (
        <div>            
                {isSignedIn ? (       
                    <Link href="/dashboard/user">
                    <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                        <User className="h-6 w-6" />
                        <span>{name}</span>
                    </div>
                    </Link>
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
