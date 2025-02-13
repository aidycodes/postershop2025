"use client"
import Link from "next/link"
import type { Category } from "@/components/categorys/categorys"
import LinkWithDropdown from "./link-with-dropdown"

export const LINKS = [{
    label:"New Arrivals",
    href:"/new-arrivals"
},
{
    label:"Categories",
    href:"/categories"
},
{
    label:"Best Sellers",
    href:"/best-sellers"
},
{
    label:"About",
    href:"/about"
},
]

const NavLinks = ({categories}: {categories: Category[]}) => {
    return (
        <div  className="hidden md:flex items-center space-x-8">
            {LINKS.map((link) => (     
                    link.label === "Categories" ? (
                        <div className="relative" key={link.href} >
                        <LinkWithDropdown key={link.href} categories={categories} label={link.label} href={link.href} />
                        </div>
                    ) : (
                        <Link key={link.href} href={link.href}>
                            <div className="flex  items-center space-x-1 transition-colors text-gray-600 hover:text-blue-500 cursor-pointer">
                                {link.label}
                            </div>
                        </Link>
                    )
            ))}
        </div>
    )
}

export default NavLinks
