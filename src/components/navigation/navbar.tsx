import { Menu } from "lucide-react"
import NavSearch from "./buttons/nav-search"
import NavCart from "./buttons/nav-cart"
import NavUser from "./buttons/nav-user"
import NavLinks from "./nav-links"
import ShopName from "./buttons/shop-name"
import type { Category } from "@/components/categorys/categorys"
import type { UserSession } from "@/app/layout"

import SignOut from "./buttons/sign-out"
interface NavbarProps {
  categories: Category[];
  session?: UserSession | null; // Make it optional and allow null
}


const Navbar = ({categories, session}: NavbarProps) => {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 mr-4 md:hidden" />
              <ShopName name="PosterHub" direction="forward" />
            </div>    
            <NavLinks categories={categories} />
            <div className="flex items-center space-x-4">
              <NavSearch />
              <NavCart isSignedIn={false} />
              <NavUser isSignedIn={session ? true : false} name={session?.name || "User"} />
              {
                session && (
               <SignOut />
              )
              }
            </div>
          </div>
        </div>
      </nav>
    )
}

export default Navbar
